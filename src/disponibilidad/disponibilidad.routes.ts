import { Router } from 'express'
import {
  sanitizeDisponibilidadInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './disponibilidad.controller.js'

export const disponibilidadRouter = Router()

disponibilidadRouter.get('/', findAll)
disponibilidadRouter.get('/:id', findOne)
disponibilidadRouter.post('/', sanitizeDisponibilidadInput, add)
disponibilidadRouter.put('/:id', sanitizeDisponibilidadInput, update)
disponibilidadRouter.patch('/:id', sanitizeDisponibilidadInput, update)
disponibilidadRouter.delete('/:id', remove)
