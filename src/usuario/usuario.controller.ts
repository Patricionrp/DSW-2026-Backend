import type { Request, Response, NextFunction } from 'express'
import {
  UniqueConstraintViolationException,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/core'
import { Usuario } from './usuario.entity.js'
import { Rol } from '../rol/rol.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      message: 'Enviá los datos del usuario como un objeto JSON',
    })
  }

  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    rol: req.body.rol,
  }

  const input = req.body.sanitizedInput

  const requiereDatosCompletos =
    req.method === 'POST' || req.method === 'PUT'

  if (requiereDatosCompletos || input.nombre !== undefined) {
    if (
      typeof input.nombre !== 'string' ||
      input.nombre.trim() === ''
    ) {
      return res.status(400).json({
        message: 'El nombre es obligatorio y debe ser un texto',
      })
    }

    input.nombre = input.nombre.trim()
  }

  if (requiereDatosCompletos || input.apellido !== undefined) {
    if (
      typeof input.apellido !== 'string' ||
      input.apellido.trim() === ''
    ) {
      return res.status(400).json({
        message: 'El apellido es obligatorio y debe ser un texto',
      })
    }

    input.apellido = input.apellido.trim()
  }

  if (requiereDatosCompletos || input.email !== undefined) {
    if (
      typeof input.email !== 'string' ||
      input.email.trim() === ''
    ) {
      return res.status(400).json({
        message: 'El email es obligatorio y debe ser un texto',
      })
    }

    input.email = input.email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      return res.status(400).json({
        message: 'El email debe tener un formato válido',
      })
    }
  }

  if (
    input.rol !== undefined &&
    (
      typeof input.rol !== 'number' ||
      !Number.isSafeInteger(input.rol) ||
      input.rol <= 0
    )
  ) {
    return res.status(400).json({
      message: 'El rol debe ser un identificador numérico entero positivo',
    })
  }

  Object.keys(input).forEach((key) => {
    if (input[key] === undefined) {
      delete input[key]
    }
  })

  if (Object.keys(input).length === 0) {
    return res.status(400).json({
      message: 'Enviá al menos un campo para modificar',
    })
  }

  next()
}

function validarUsuarioId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const valor = req.params.id

  if (
    typeof valor !== 'string' ||
    !/^[1-9]\d*$/.test(valor) ||
    !Number.isSafeInteger(Number(valor))
  ) {
    return res.status(400).json({
      message: 'El identificador del usuario debe ser un entero positivo',
    })
  }

  next()
}

async function findAll(_req: Request, res: Response) {
  try {
    const usuarios = await em.find(
      Usuario,
      {},
      { populate: ['rol'] }
    )

    res.status(200).json({ data: usuarios })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudieron consultar los usuarios',
    })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

    const usuario = await em.findOne(
      Usuario,
      { id },
      { populate: ['rol'] }
    )

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    res.status(200).json({ data: usuario })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'No se pudo consultar el usuario',
    })
  }
}

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput

    const existente = await em.findOne(Usuario, {
      email: input.email,
    })

    if (existente) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese email',
      })
    }

    const rol =
      input.rol === undefined
        ? await em.findOne(Rol, { nombre: 'usuario' })
        : await em.findOne(Rol, { id: input.rol })

    if (!rol) {
      return res.status(404).json({
        message: 'Rol no encontrado',
      })
    }

    const usuario = em.create(Usuario, { ...input, rol })

    await em.flush()

    res.status(201).json({
      message: 'Usuario creado',
      data: usuario,
    })
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese email',
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'No se pudo crear el usuario',
    })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await em.findOne(Usuario, { id })

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    const input = req.body.sanitizedInput

    if (input.email !== undefined) {
      const existente = await em.findOne(Usuario, {
        email: input.email,
      })

      if (existente && existente.id !== id) {
        return res.status(409).json({
          message: 'Ya existe otro usuario con ese email',
        })
      }
    }

    if (input.rol !== undefined) {
      const rol = await em.findOne(Rol, { id: input.rol })

      if (!rol) {
        return res.status(404).json({
          message: 'Rol no encontrado',
        })
      }
    }

    em.assign(usuario, input)

    await em.flush()

    res.status(200).json({
      message: 'Usuario actualizado',
      data: usuario,
    })
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({
        message: 'Ya existe otro usuario con ese email',
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'No se pudo actualizar el usuario',
    })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const usuario = await em.findOne(Usuario, { id })

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    em.remove(usuario)

    await em.flush()

    res.status(200).json({
      message: 'Usuario eliminado',
    })
  } catch (error) {
    if (error instanceof ForeignKeyConstraintViolationException) {
      return res.status(409).json({
        message:
          'No se puede eliminar el usuario porque tiene registros asociados',
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'No se pudo eliminar el usuario',
    })
  }
}

export {
  sanitizeUsuarioInput,
  validarUsuarioId,
  findAll,
  findOne,
  add,
  update,
  remove,
}