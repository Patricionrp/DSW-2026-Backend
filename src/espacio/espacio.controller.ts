import { Request, Response, NextFunction } from 'express'
import { Espacio } from './espacio.entity.js'
import { orm } from '../shared/db/orm.js'
import { Disponibilidad } from '../disponibilidad/disponibilidad.entity.js'
import { Reserva } from '../reserva/reserva.entity.js'

const em = orm.em

function sanitizeEspacioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    capacidad: req.body.capacidad,
    tipo: req.body.tipo,
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const espacio = em.create(Espacio, req.body.sanitizedInput)
    await em.flush()
    res.status(201).send({ message: 'Espacio created', data: espacio })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeEspacioInput, findAll, findOne, add, update, remove }