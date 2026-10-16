import { Request, Response, NextFunction } from 'express'
import { Espacio } from './espacio.entity.js'
import { orm } from '../shared/db/orm.js'
import {
  espaciosPorDisponibilidad,
  fechaValida,
  horaValida,
} from '../shared/disponibilidad.js'

const em = orm.em

const modosDeListado = ['todos', 'disponibles', 'no_disponibles'] as const
type ModoDeListado = (typeof modosDeListado)[number]

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
    const { disponibilidad, fecha, horaInicio, horaFin } = req.query
    const modo = disponibilidad === undefined ? 'todos' : disponibilidad

    if (!modosDeListado.includes(modo as ModoDeListado)) {
      return res
        .status(400)
        .send({ message: 'disponibilidad inválida (todos, disponibles o no_disponibles)' })
    }

    if (modo === 'todos') {
      const espacios = await em.find(Espacio, {})
      return res.status(200).json({ data: espacios })
    }

    if (typeof fecha !== 'string' || typeof horaInicio !== 'string' || typeof horaFin !== 'string') {
      return res.status(400).send({
        message: 'fecha, horaInicio y horaFin son requeridos para filtrar por disponibilidad',
      })
    }

    if (!fechaValida(fecha)) {
      return res.status(400).send({ message: 'Fecha inválida (formato AAAA-MM-DD)' })
    }

    if (!horaValida(horaInicio) || !horaValida(horaFin)) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    if (horaFin <= horaInicio) {
      return res.status(400).send({ message: 'horaFin debe ser posterior a horaInicio' })
    }

    const espacios = await espaciosPorDisponibilidad(
      { fecha, horaInicio, horaFin },
      modo as 'disponibles' | 'no_disponibles'
    )
    res.status(200).json({ data: espacios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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