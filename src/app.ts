import express from 'express'
import { espacioRouter } from './espacio/espacio.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { reservaRouter } from './reserva/reserva.routes.js'

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
  res.send('TP-Backend')
})

app.use('/api/espacios', espacioRouter)

app.use('/api/usuarios', usuarioRouter)

app.use('/api/reservas', reservaRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})


app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})

