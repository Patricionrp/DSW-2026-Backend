import { Request, Response, NextFunction } from 'express'
import { Espacio } from './espacio.entity.js'
import { orm } from '../shared/db/orm.js'
import { Disponibilidad } from '../disponibilidad/disponibilidad.entity.js'
import { Reserva } from '../reserva/reserva.entity.js'
import { ForeignKeyConstraintViolationException } from '@mikro-orm/core'

const em = orm.em

function sanitizeEspacioInput(
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
      message: 'Enviá los datos del espacio como un objeto JSON',
    })
  }

  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    capacidad: req.body.capacidad,
    tipo: req.body.tipo,
  }

  const input = req.body.sanitizedInput

  const requiereDatosCompletos =
    req.method === 'POST' || req.method === 'PUT'

  if (requiereDatosCompletos || input.nombre !== undefined) {
    if (
      typeof input.nombre !== 'string' ||
      input.nombre.trim() === ''
    ) {
      return res.status(400).json({
        message: 'El nombre es obligatorio y debe ser un texto',
      })
    }

    input.nombre = input.nombre.trim()
  }

  if (requiereDatosCompletos || input.tipo !== undefined) {
    if (
      typeof input.tipo !== 'string' ||
      input.tipo.trim() === ''
    ) {
      return res.status(400).json({
        message: 'El tipo es obligatorio y debe ser un texto',
      })
    }

    input.tipo = input.tipo.trim()
  }

  if (requiereDatosCompletos || input.capacidad !== undefined) {
    if (
      typeof input.capacidad !== 'number' ||
      !Number.isSafeInteger(input.capacidad) ||
      input.capacidad <= 0
    ) {
      return res.status(400).json({
        message: 'La capacidad debe ser un número entero mayor que cero',
      })
    }
  }

  if (
    input.descripcion !== undefined &&
    input.descripcion !== null
  ) {
    if (typeof input.descripcion !== 'string') {
      return res.status(400).json({
        message: 'La descripción debe ser un texto',
      })
    }

    input.descripcion = input.descripcion.trim()
  }

  Object.keys(input).forEach((key) => {
    if (input[key] === undefined) {
      delete input[key]
    }
  })

  if (Object.keys(input).length === 0) {
    return res.status(400).json({
      message: 'Enviá al menos un campo para modificar',
    })
  }

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const disponibilidad = req.query.disponibilidad

    if (
      disponibilidad === undefined ||
      disponibilidad === 'todos'
    ) {
      const espacios = await em.find(Espacio, {})

      return res.status(200).json({ data: espacios })
    }

    if (
      disponibilidad !== 'disponibles' &&
      disponibilidad !== 'no_disponibles'
    ) {
      return res.status(400).json({
        message:
          'disponibilidad debe ser todos, disponibles o no_disponibles',
      })
    }

    const fecha = req.query.fecha
    const horaInicio = req.query.horaInicio
    const horaFin = req.query.horaFin

    if (
      typeof fecha !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
      return res.status(400).json({
        message: 'fecha es requerida y debe tener formato AAAA-MM-DD',
      })
    }

    const fechaConvertida = new Date(fecha)

    if (
      Number.isNaN(fechaConvertida.getTime()) ||
      fechaConvertida.toISOString().slice(0, 10) !== fecha
    ) {
      return res.status(400).json({
        message: 'La fecha indicada no existe',
      })
    }

    const formatoHora = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

    if (
      typeof horaInicio !== 'string' ||
      typeof horaFin !== 'string' ||
      !formatoHora.test(horaInicio) ||
      !formatoHora.test(horaFin)
    ) {
      return res.status(400).json({
        message:
          'horaInicio y horaFin son requeridas con formato HH:mm:ss',
      })
    }

    if (horaFin <= horaInicio) {
      return res.status(400).json({
        message: 'La hora de fin debe ser posterior a la de inicio',
      })
    }

    const diaSemana = fechaConvertida.getUTCDay()

    const espacios = await em.find(Espacio, {})

    const franjas = await em.find(Disponibilidad, {
      diaSemana,
      horaInicio: { $lte: horaInicio },
      horaFin: { $gte: horaFin },
    })

    const reservasSolapadas = await em.find(Reserva, {
      fecha,
      estado: {
        nombre: { $in: ['pendiente', 'aprobada'] },
      },
      horaInicio: { $lt: horaFin },
      horaFin: { $gt: horaInicio },
    })

    const resultado = espacios.filter((espacio) => {
      const tieneHorario = franjas.some(
        (franja) => franja.espacio.id === espacio.id
      )

      const estaOcupado = reservasSolapadas.some(
        (reserva) => reserva.espacio.id === espacio.id
      )

      const estaDisponible = tieneHorario && !estaOcupado

      if (disponibilidad === 'disponibles') {
        return estaDisponible
      }

      return !estaDisponible
    })

    res.status(200).json({ data: resultado })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudieron consultar los espacios',
    })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const espacio = await em.findOne(Espacio, { id })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio not found' })
    }
    res.status(200).json({ data: espacio })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo completar la operación. Intentá nuevamente.',
    })
  }
}

async function add(req: Request, res: Response) {
  try {
    const espacio = em.create(Espacio, req.body.sanitizedInput)
    await em.flush()
    res.status(201).send({ message: 'Espacio created', data: espacio })
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
    const espacio = await em.findOne(Espacio, { id })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio not found' })
    }
    em.assign(espacio, req.body.sanitizedInput)
    await em.flush()
    res.status(200).send({ message: 'Espacio updated successfully', data: espacio })
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
    const espacio = await em.findOne(Espacio, { id })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio not found' })
    }
    em.remove(espacio)
    await em.flush()
    res.status(200).send({ message: 'Espacio deleted successfully' })
  } catch (error) {
    if (error instanceof ForeignKeyConstraintViolationException) {
      return res.status(409).json({
        message:
          'No se puede eliminar el espacio porque tiene reservas o disponibilidades asociadas',
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'No se pudo eliminar el espacio. Intentá nuevamente.',
    })
  }
}

export { sanitizeEspacioInput, findAll, findOne, add, update, remove }