import { Request, Response, NextFunction } from 'express'
import { Reserva } from './reserva.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'
import { Estado } from '../estado/estado.entity.js'
import { Disponibilidad } from '../disponibilidad/disponibilidad.entity.js'
import { orm } from '../shared/db/orm.js'
import type { FilterQuery } from '@mikro-orm/core'

const em = orm.em

const estadosQueBloquean = ['pendiente', 'aprobada']

const transiciones: Record<string, string[]> = {
  pendiente: ['aprobada', 'rechazada', 'cancelada'],
  aprobada: ['cancelada'],
  rechazada: [],
  cancelada: [],
}

function fechaValida(fecha: unknown) {
  if (
    typeof fecha !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
  ) {
    return false
  }

  const fechaConvertida = new Date(fecha)

  if (Number.isNaN(fechaConvertida.getTime())) {
    return false
  }

  return fechaConvertida.toISOString().slice(0, 10) === fecha
}

function horaValida(hora: unknown) {
  return (
    typeof hora === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)
  )
}

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

function sanitizeReservaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      message: 'Enviá los datos de la reserva como un objeto JSON',
    })
  }

  req.body.sanitizedInput = {
    usuario: req.body.usuario,
    espacio: req.body.espacio,
    estado: req.body.estado,
    fecha: req.body.fecha,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
  }

  const input = req.body.sanitizedInput

  for (const campo of ['usuario', 'espacio', 'estado']) {
    const valor = input[campo]

    if (
      valor !== undefined &&
      (
        typeof valor !== 'number' ||
        !Number.isSafeInteger(valor) ||
        valor <= 0
      )
    ) {
      return res.status(400).json({
        message: `${campo} debe ser un identificador numérico entero positivo`,
      })
    }
  }

  Object.keys(input).forEach((key) => {
    if (input[key] === undefined) {
      delete input[key]
    }
  })

  if (Object.keys(input).length === 0) {
    return res.status(400).json({
      message: 'Enviá al menos un campo de la reserva',
    })
  }

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const estado = req.query.estado
    const fecha = req.query.fecha

    const filtros: FilterQuery<Reserva> = {}

    if (estado !== undefined) {
      const estadosPermitidos = [
        'pendiente',
        'aprobada',
        'rechazada',
        'cancelada',
      ]

      if (
        typeof estado !== 'string' ||
        !estadosPermitidos.includes(estado)
      ) {
        return res.status(400).json({
          message: 'Estado inválido. Usá pendiente, aprobada, rechazada o cancelada',
        })
      }

      filtros.estado = { nombre: estado }
    }

    if (fecha !== undefined) {
      if (
        typeof fecha !== 'string' ||
        !fechaValida(fecha)
      ) {
        return res.status(400).json({
          message: 'Fecha inválida. Usá una fecha existente con formato AAAA-MM-DD',
        })
      }

      filtros.fecha = fecha
    }

    const reservas = await em.find(Reserva, filtros, {
      populate: ['usuario', 'espacio', 'estado'],
    })

    res.status(200).json({ data: reservas })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudieron consultar las reservas',
    })
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
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo completar la operación. Intentá nuevamente.',
    })
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
      console.error('No existe el estado pendiente en la base de datos')

      return res.status(500).json({
        message: 'No se pudo crear la reserva. Intentá más tarde.',
      })
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
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo completar la operación. Intentá nuevamente.',
    })
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
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo completar la operación. Intentá nuevamente.',
    })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const reserva = await em.findOne(Reserva, { id })

    if (!reserva) {
      return res.status(404).json({
        message: 'Reserva no encontrada',
      })
    }

    em.remove(reserva)
    await em.flush()

    res.status(200).json({
      message: 'Reserva eliminada',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo eliminar la reserva. Intentá nuevamente.',
    })
  }
}

export { sanitizeReservaInput, findAll, findOne, add, update, remove }
