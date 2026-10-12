import { Request, Response, NextFunction } from 'express'
import { Usuario } from './usuario.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

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

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {})
    res.status(200).json({ data: usuarios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const usuario = await em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario not found' })
    }
    res.status(200).json({ data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput)
    await em.flush()
    res.status(201).send({ message: 'Usuario created', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const usuario = await em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario not found' })
    }
    em.assign(usuario, req.body.sanitizedInput)
    await em.flush()
    res.status(200).send({ message: 'Usuario updated successfully', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const usuario = await em.findOne(Usuario, { id })
    if (!usuario) {
      return res.status(404).send({ message: 'Usuario not found' })
    }
    em.remove(usuario)
    await em.flush()
    res.status(200).send({ message: 'Usuario deleted successfully', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove }