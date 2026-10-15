import { Request, Response, NextFunction } from 'express'
import { Reserva } from './reserva.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'
import { Estado } from '../estado/estado.entity.js'
import { Disponibilidad } from '../disponibilidad/disponibilidad.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

const estadosQueBloquean = ['pendiente', 'aprobada']

const transiciones: Record<string, string[]> = {
  pendiente: ['aprobada', 'rechazada', 'cancelada'],
  aprobada: ['cancelada'],
  rechazada: [],
  cancelada: [],
}

const fechaValida = (fecha: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(new Date(fecha).getTime())

const horaValida = (hora: string) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)

type DatosReserva = {
  espacio: Espacio
  fecha: string
  horaInicio: string
  horaFin: string
}

async function conflictoDeReserva(datos: DatosReserva, excluirId?: number) {
  if (datos.horaFin <= datos.horaInicio) {
    return { status: 400, message: 'horaFin debe ser posterior a horaInicio' }
  }

  const diaSemana = new Date(datos.fecha).getUTCDay()
  const franjas = await em.count(Disponibilidad, {
    espacio: datos.espacio,
    diaSemana,
    horaInicio: { $lte: datos.horaInicio },
    horaFin: { $gte: datos.horaFin },
  })
  if (franjas === 0) {
    return { status: 400, message: 'El espacio no tiene disponibilidad en ese día y horario' }
  }

  const solapadas = await em.count(Reserva, {
    ...(excluirId !== undefined && { id: { $ne: excluirId } }),
    espacio: datos.espacio,
    fecha: datos.fecha,
    estado: { nombre: { $in: estadosQueBloquean } },
    horaInicio: { $lt: datos.horaFin },
    horaFin: { $gt: datos.horaInicio },
  })
  if (solapadas > 0) {
    return { status: 409, message: 'El espacio ya tiene una reserva en ese horario' }
  }

  return null
}

function sanitizeReservaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    usuario: req.body.usuario,
    espacio: req.body.espacio,
    estado: req.body.estado,
    fecha: req.body.fecha,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const reservas = await em.find(Reserva, {}, { populate: ['usuario', 'espacio', 'estado'] })
    res.status(200).json({ data: reservas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const reserva = await em.findOne(
      Reserva,
      { id },
      { populate: ['usuario', 'espacio', 'estado'] }
    )
    if (!reserva) {
      return res.status(404).send({ message: 'Reserva not found' })
    }
    res.status(200).json({ data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput

    if (!input.usuario || !input.espacio || !input.fecha || !input.horaInicio || !input.horaFin) {
      return res
        .status(400)
        .send({ message: 'usuario, espacio, fecha, horaInicio y horaFin son requeridos' })
    }

    const usuario = await em.findOne(Usuario, { id: input.usuario })
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    const espacio = await em.findOne(Espacio, { id: input.espacio })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio no encontrado' })
    }

    if (!fechaValida(input.fecha)) {
      return res.status(400).send({ message: 'Fecha inválida (formato AAAA-MM-DD)' })
    }

    if (!horaValida(input.horaInicio) || !horaValida(input.horaFin)) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    const estado = await em.findOne(Estado, { nombre: 'pendiente' })
    if (!estado) {
      return res
        .status(500)
        .send({ message: 'Estado pendiente no encontrado (¿se ejecutó el seed?)' })
    }

    const conflicto = await conflictoDeReserva({
      espacio,
      fecha: input.fecha,
      horaInicio: input.horaInicio,
      horaFin: input.horaFin,
    })
    if (conflicto) {
      return res.status(conflicto.status).send({ message: conflicto.message })
    }

    const reserva = em.create(Reserva, {
      usuario,
      espacio,
      estado,
      fecha: input.fecha,
      horaInicio: input.horaInicio,
      horaFin: input.horaFin,
    })
    await em.flush()
    res.status(201).send({ message: 'Reserva creada', data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const reserva = await em.findOne(Reserva, { id }, { populate: ['estado'] })
    if (!reserva) {
      return res.status(404).send({ message: 'Reserva no encontrada' })
    }

    const estadoActual = reserva.estado.nombre
    const siguientes = transiciones[estadoActual] ?? []
    if (siguientes.length === 0) {
      return res.status(409).send({ message: `No se puede modificar una reserva ${estadoActual}` })
    }

    const input = req.body.sanitizedInput

    const usuario =
      input.usuario === undefined
        ? reserva.usuario
        : await em.findOne(Usuario, { id: input.usuario })
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    const espacio =
      input.espacio === undefined
        ? reserva.espacio
        : await em.findOne(Espacio, { id: input.espacio })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio no encontrado' })
    }

    const estado =
      input.estado === undefined
        ? reserva.estado
        : await em.findOne(Estado, { id: input.estado })
    if (!estado) {
      return res.status(400).send({ message: 'Estado inválido' })
    }

    if (estado.id !== reserva.estado.id && !siguientes.includes(estado.nombre)) {
      return res.status(409).send({
        message: `Transición de estado no permitida: de ${estadoActual} a ${estado.nombre}`,
      })
    }

    if (input.fecha !== undefined && !fechaValida(input.fecha)) {
      return res.status(400).send({ message: 'Fecha inválida (formato AAAA-MM-DD)' })
    }

    if (
      (input.horaInicio !== undefined && !horaValida(input.horaInicio)) ||
      (input.horaFin !== undefined && !horaValida(input.horaFin))
    ) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    const fecha = input.fecha ?? reserva.fecha
    const horaInicio = input.horaInicio ?? reserva.horaInicio
    const horaFin = input.horaFin ?? reserva.horaFin

    if (estadosQueBloquean.includes(estado.nombre)) {
      const conflicto = await conflictoDeReserva({ espacio, fecha, horaInicio, horaFin }, reserva.id)
      if (conflicto) {
        return res.status(conflicto.status).send({ message: conflicto.message })
      }
    }

    em.assign(reserva, { usuario, espacio, estado, fecha, horaInicio, horaFin })
    await em.flush()
    res.status(200).send({ message: 'Reserva actualizada', data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const reserva = await em.findOne(Reserva, { id })
    if (!reserva) {
      return res.status(404).send({ message: 'Reserva no encontrada' })
    }
    em.remove(reserva)
    await em.flush()
    res.status(200).send({ message: 'Reserva eliminada', data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeReservaInput, findAll, findOne, add, update, remove }
