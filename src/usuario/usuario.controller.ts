import { Request, Response, NextFunction } from 'express'
import { usuarioRepository } from './usuario.repository.js'
import { Usuario } from './usuario.entity.js'


const repository = new usuarioRepository()

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
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
  const usuario = repository.findOne({ id })
  if (!usuario) {
    return res.status(404).send({ message: 'Usuario not found' })
  }
  res.json({ data: usuario })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput 
  const usuarioInput = new Usuario(
    input.nombre,
    input.apellido,
    input.email,
  )
  
  const usuario = repository.add(usuarioInput)
  return res.status(201).send({ message: 'Usuario created', data: usuario })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const usuario = repository.update(req.body.sanitizedInput)

  if (!usuario) {
    return res.status(404).send({ message: 'Usuario not found' })
  }

  return res.status(200).send({ message: 'Usuario updated successfully', data: usuario })
}   

function remove(req: Request, res: Response) {
  const id = req.params.id as string
  const usuario = repository.delete({ id })

  if (!usuario) {
    return res.status(404).send({ message: 'Usuario not found' })
  }

  return res.status(200).send({ message: 'Usuario deleted successfully', data: usuario })
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove }   

