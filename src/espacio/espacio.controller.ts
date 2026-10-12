import { Request, Response, NextFunction } from 'express'
import { Espacio } from './espacio.entity.js'
import { orm } from '../shared/db/orm.js'

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
    const espacios = await em.find(Espacio, {})
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