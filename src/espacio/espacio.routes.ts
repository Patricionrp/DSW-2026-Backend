import { Router } from 'express'
import { sanitizeEspacioInput, findAll, findOne, add, update, remove } from './espacio.controller.js'

export const espacioRouter = Router()

espacioRouter.get('/', findAll)
espacioRouter.get('/:id', findOne)
espacioRouter.post('/', sanitizeEspacioInput, add)
espacioRouter.put('/:id', sanitizeEspacioInput, update)
espacioRouter.patch('/:id', sanitizeEspacioInput, update)
espacioRouter.delete('/:id', remove)
