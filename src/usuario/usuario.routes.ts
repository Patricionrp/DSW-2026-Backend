import { Router } from 'express'
import {
  sanitizeUsuarioInput,
  validarUsuarioId,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './usuario.controller.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)

usuarioRouter.get('/:id', validarUsuarioId, findOne)

usuarioRouter.post('/', sanitizeUsuarioInput, add)

usuarioRouter.put(
  '/:id',
  validarUsuarioId,
  sanitizeUsuarioInput,
  update
)

usuarioRouter.patch(
  '/:id',
  validarUsuarioId,
  sanitizeUsuarioInput,
  update
)

usuarioRouter.delete('/:id', validarUsuarioId, remove)