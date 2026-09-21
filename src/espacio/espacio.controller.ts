import { Request, Response, NextFunction } from 'express'
import { EspacioRepository } from './espacio.repository.js'
import { Espacio } from './espacio.entity.js'

const repository = new EspacioRepository()

function sanitizeEspacioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    capacidad: req.body.capacidad,
    tipo: req.body.tipo,
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id as string
  const espacio = repository.findOne({ id })
  if (!espacio) {
    return res.status(404).send({ message: 'Espacio not found' })
  }
  res.json({ data: espacio })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const espacioInput = new Espacio(
    input.nombre,
    input.descripcion,
    input.capacidad,
    input.tipo
  )

  const espacio = repository.add(espacioInput)
  return res.status(201).send({ message: 'Espacio created', data: espacio })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const espacio = repository.update(req.body.sanitizedInput)

  if (!espacio) {
    return res.status(404).send({ message: 'Espacio not found' })
  }

  return res.status(200).send({ message: 'Espacio updated successfully', data: espacio })
}

function remove(req: Request, res: Response) {
  const id = req.params.id as string
  const espacio = repository.delete({ id })

  if (!espacio) {
    res.status(404).send({ message: 'Espacio not found' })
  } else {
    res.status(200).send({ message: 'Espacio deleted successfully' })
  }
}

export { sanitizeEspacioInput, findAll, findOne, add, update, remove }
