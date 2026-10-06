import { Request, Response, NextFunction } from 'express'
import { ReservaRepository } from './reserva.repository.js'
import { UsuarioRepository } from '../usuario/usuario.repository.js'
import { EspacioRepository } from '../espacio/espacio.repository.js'
import { Reserva } from './reserva.entity.js'

const reservaRepository = new ReservaRepository()
const usuarios = new UsuarioRepository()
const espacios = new EspacioRepository()


function sanitizeReservaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    usuarioId: req.body.usuarioId,
    espacioId: req.body.espacioId,
    fecha: req.body.fecha,
    estado: req.body.estado,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: reservaRepository.findAll() })
}

function findOne(req: Request, res: Response) {
  const reserva = reservaRepository.findOne({ id: req.params.id as Reserva['id'] })

  if (!reserva) {
    return res.status(404).send({ message: 'Reserva not found' })
  }

  return res.json({ data: reserva })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  if(!input.usuarioId || !input.espacioId || !input.fecha ) {
    return res.status(400).send( { message: 'usuarioId, espacioId y fecha son requeridos'})
  }
  
  if(!usuarios.findOne({ id: input.usuarioId })) {
    return res.status(404).send({ message: 'Usuario no encontrado' })
  }

  if(!espacios.findOne({ id: input.espacioId})) {
    return res.status(404).send({message: 'Espacio no encontrado'})
  }

  const fecha = new Date(input.fecha)

  if (Number.isNaN(fecha.getTime())) {
    return res.status(400).send({ message: 'Fecha inválida' })
  }

  const reserva = reservaRepository.add(
    new Reserva(input.usuarioId, input.espacioId, fecha)
  )

  return res.status(201).send({message: 'Reserva creada', data: reserva})
}

function update(req: Request, res: Response) {
  const id = req.params.id as Reserva['id']
  const actual = reservaRepository.findOne({ id })

  if (!actual) {
    return res.status(404).send({ message: 'Reserva no encontrada' })
  }

  const input = req.body.sanitizedInput
  const usuarioId = input.usuarioId ?? actual.usuarioId
  const espacioId = input.espacioId ?? actual.espacioId
  const fecha = input.fecha === undefined ? actual.fecha : new Date(input.fecha)
  const estado = input.estado ?? actual.estado

  if (!usuarios.findOne({ id: usuarioId })) {
    return res.status(404).send({ message: 'Usuario no encontrado' })
  }

  if (!espacios.findOne({ id: espacioId })) {
    return res.status(404).send({ message: 'Espacio no encontrado' })
  }

  if (Number.isNaN(fecha.getTime())) {
    return res.status(400).send({ message: 'Fecha inválida' })
  }

  const estadosValidos: Reserva['estado'][] = ['pendiente', 'confirmada', 'cancelada', 'rechazada']
  if (!estadosValidos.includes(estado)) {
    return res.status(400).send({ message: 'Estado inválido' })
  }

  const reserva = reservaRepository.update({ id, usuarioId, espacioId, fecha, estado })
  
  return res.status(200).send({ message: 'Reserva actualizada', data: reserva })
}

function remove(req: Request, res: Response) {
  const id = req.params.id as Reserva['id']
  const reserva = reservaRepository.delete({ id })
  
  if (!reserva) {
    return res.status(404).send({ message: 'Reserva no encontrada' })
  }

  return res.status(200).send({ message: 'Reserva eliminada', data: reserva })
}

export { sanitizeReservaInput, findAll, findOne, add, update, remove }



