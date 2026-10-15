import { Request, Response, NextFunction } from 'express'
import { Reserva } from './reserva.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'
import { Estado } from '../estado/estado.entity.js'
import { orm } from '../shared/db/orm.js'
import type { FilterQuery } from '@mikro-orm/core'

const em = orm.em

const fechaValida = (fecha: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(new Date(fecha).getTime())

const horaValida = (hora: string) => /^\d{2}:\d{2}:\d{2}$/.test(hora)

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
        !fechaValida(fecha) ||
        new Date(fecha).toISOString().slice(0, 10) !== fecha
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput

    if (input.estado !== undefined) {
      return res.status(400).json({
      message: 'Las reservas nuevas se crean pendientes. Omití el campo estado',
    })
}

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
    const estado = await em.findOne(Estado, {
    nombre: 'pendiente',
    })

    if (!estado) {
      return res.status(500).json({
    message: 'No está configurado el estado pendiente', })
    }

    if (!fechaValida(input.fecha)) {
      return res.status(400).send({ message: 'Fecha inválida (formato AAAA-MM-DD)' })
    }

    if (!horaValida(input.horaInicio) || !horaValida(input.horaFin)) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    const reserva = em.create(Reserva, { ...input, usuario, espacio, estado })
    await em.flush()
    res.status(201).send({ message: 'Reserva creada', data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const reserva = await em.findOne(Reserva, { id })
    if (!reserva) {
      return res.status(404).send({ message: 'Reserva no encontrada' })
    }

    const input = req.body.sanitizedInput

    if (input.usuario !== undefined && !(await em.findOne(Usuario, { id: input.usuario }))) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    if (input.estado !== undefined) {
    return res.status(400).json({
      message: 'El estado se modifica mediante la operación de aprobación o rechazo',
    })
    }

    if (input.espacio !== undefined && !(await em.findOne(Espacio, { id: input.espacio }))) {
      return res.status(404).send({ message: 'Espacio no encontrado' })
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

    em.assign(reserva, input)
    await em.flush()
    res.status(200).send({ message: 'Reserva actualizada', data: reserva })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function cambiarEstado(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const estadoSolicitado = req.body?.estado

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'El ID de la reserva debe ser un número entero positivo',
      })
    }

    if (
      estadoSolicitado !== 'aprobada' &&
      estadoSolicitado !== 'rechazada'
    ) {
      return res.status(400).json({
        message: 'El estado solicitado debe ser aprobada o rechazada',
      })
    }

    const reserva = await em.findOne(
      Reserva,
      { id },
      { populate: ['estado'] }
    )

    if (!reserva) {
      return res.status(404).json({
        message: 'Reserva no encontrada',
      })
    }

    if (reserva.estado.nombre !== 'pendiente') {
      return res.status(409).json({
        message: 'Solo se puede aprobar o rechazar una reserva pendiente',
      })
    }

    const estadoNuevo = await em.findOne(Estado, {
      nombre: estadoSolicitado,
    })

    if (!estadoNuevo) {
      return res.status(500).json({
        message: 'No está configurado el estado solicitado',
      })
    }

    const cantidadActualizada = await em.nativeUpdate(
      Reserva,
      { id, estado: reserva.estado },
      { estado: estadoNuevo }
    )

    if (cantidadActualizada !== 1) {
      return res.status(409).json({
        message: 'La reserva cambió durante la operación. Actualizá el listado',
      })
    }

    res.status(200).json({
      message: `Reserva ${estadoSolicitado}`,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo cambiar el estado de la reserva',
    })
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

export {
  sanitizeReservaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  cambiarEstado,
}