import { Router } from 'express'
import { findAll } from './estado.controller.js'

export const estadoRouter = Router()

estadoRouter.get('/', findAll)
