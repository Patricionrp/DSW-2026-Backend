import type { Request, Response } from 'express'
import { Estado } from './estado.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(_req: Request, res: Response) {
  try {
    const estados = await em.find(Estado, {})

    res.status(200).json({ data: estados })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudieron consultar los estados',
    })
  }
}

export { findAll }