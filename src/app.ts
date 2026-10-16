import 'reflect-metadata'
import express from 'express'
import { espacioRouter } from './espacio/espacio.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { reservaRouter } from './reserva/reserva.routes.js'
import { disponibilidadRouter } from './disponibilidad/disponibilidad.routes.js'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './shared/db/orm.js'
import { seed } from './shared/db/seed.js'
import { estadoRouter } from './estado/estado.routes.js'
import type { ErrorRequestHandler } from 'express'


const app = express()
app.use(express.json())

app.use((req, res, next) => {                              // después de express.json()
  RequestContext.create(orm.em, next)
})

app.get('/', function (req, res) {
  res.send('TP-Backend')
})

app.use('/api/espacios', espacioRouter)

app.use('/api/usuarios', usuarioRouter)

app.use('/api/reservas', reservaRouter)

app.use('/api/disponibilidades', disponibilidadRouter)

app.use('/api/estados', estadoRouter)

app.use((_, res) => {
  return res.status(404).json({
    message: 'La ruta solicitada no existe',
  })
})

const manejarErrores: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  if (
    error instanceof SyntaxError &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      message: 'El JSON enviado no tiene un formato válido',
    })
  }

  if (
    typeof error?.status === 'number' &&
    Number.isInteger(error.status) &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return res.status(error.status).json({
      message: 'No se pudo procesar la solicitud. Revisá los datos enviados.',
    })
  }

  console.error(error)

  return res.status(500).json({
    message: 'Ocurrió un error en el servidor. Intentá nuevamente.',
  })
}

app.use(manejarErrores)

await syncSchema()
await seed()
app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})

