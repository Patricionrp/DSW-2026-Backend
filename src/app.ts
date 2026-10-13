import 'reflect-metadata'
import express from 'express'
import { espacioRouter } from './espacio/espacio.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { reservaRouter } from './reserva/reserva.routes.js'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './shared/db/orm.js'
import { seed } from './shared/db/seed.js'
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

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()
await seed()
app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})

