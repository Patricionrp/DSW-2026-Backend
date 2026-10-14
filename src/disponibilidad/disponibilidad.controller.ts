import { Request, Response, NextFunction } from 'express'
import { Disponibilidad } from './disponibilidad.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

const diaValido = (dia: unknown) => Number.isInteger(dia) && (dia as number) >= 0 && (dia as number) <= 6

const horaValida = (hora: unknown) =>
  typeof hora === 'string' && /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)

function sanitizeDisponibilidadInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    espacio: req.body.espacio,
    diaSemana: req.body.diaSemana,
    horaInicio: req.body.horaInicio,
    horaFin: req.body.horaFin,
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
    const disponibilidades = await em.find(Disponibilidad, {}, { populate: ['espacio'] })
    res.status(200).json({ data: disponibilidades })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const disponibilidad = await em.findOne(Disponibilidad, { id }, { populate: ['espacio'] })
    if (!disponibilidad) {
      return res.status(404).send({ message: 'Disponibilidad no encontrada' })
    }
    res.status(200).json({ data: disponibilidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput

    if (!input.espacio || input.diaSemana === undefined || !input.horaInicio || !input.horaFin) {
      return res
        .status(400)
        .send({ message: 'espacio, diaSemana, horaInicio y horaFin son requeridos' })
    }

    const espacio = await em.findOne(Espacio, { id: input.espacio })
    if (!espacio) {
      return res.status(404).send({ message: 'Espacio no encontrado' })
    }

    if (!diaValido(input.diaSemana)) {
      return res.status(400).send({ message: 'diaSemana inválido (0=domingo ... 6=sábado)' })
    }

    if (!horaValida(input.horaInicio) || !horaValida(input.horaFin)) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    if (input.horaFin <= input.horaInicio) {
      return res.status(400).send({ message: 'horaFin debe ser posterior a horaInicio' })
    }

    const disponibilidad = em.create(Disponibilidad, { ...input, espacio })
    await em.flush()
    res.status(201).send({ message: 'Disponibilidad creada', data: disponibilidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const disponibilidad = await em.findOne(Disponibilidad, { id })
    if (!disponibilidad) {
      return res.status(404).send({ message: 'Disponibilidad no encontrada' })
    }

    const input = req.body.sanitizedInput

    if (input.espacio !== undefined && !(await em.findOne(Espacio, { id: input.espacio }))) {
      return res.status(404).send({ message: 'Espacio no encontrado' })
    }

    if (input.diaSemana !== undefined && !diaValido(input.diaSemana)) {
      return res.status(400).send({ message: 'diaSemana inválido (0=domingo ... 6=sábado)' })
    }

    if (
      (input.horaInicio !== undefined && !horaValida(input.horaInicio)) ||
      (input.horaFin !== undefined && !horaValida(input.horaFin))
    ) {
      return res.status(400).send({ message: 'Hora inválida (formato HH:mm:ss)' })
    }

    const horaInicio = input.horaInicio ?? disponibilidad.horaInicio
    const horaFin = input.horaFin ?? disponibilidad.horaFin
    if (horaFin <= horaInicio) {
      return res.status(400).send({ message: 'horaFin debe ser posterior a horaInicio' })
    }

    em.assign(disponibilidad, input)
    await em.flush()
    res.status(200).send({ message: 'Disponibilidad actualizada', data: disponibilidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id as string)
    const disponibilidad = await em.findOne(Disponibilidad, { id })
    if (!disponibilidad) {
      return res.status(404).send({ message: 'Disponibilidad no encontrada' })
    }
    em.remove(disponibilidad)
    await em.flush()
    res.status(200).send({ message: 'Disponibilidad eliminada', data: disponibilidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeDisponibilidadInput, findAll, findOne, add, update, remove }
