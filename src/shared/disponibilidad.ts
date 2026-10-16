import { Espacio } from '../espacio/espacio.entity.js'
import { Disponibilidad } from '../disponibilidad/disponibilidad.entity.js'
import { Reserva } from '../reserva/reserva.entity.js'
import { orm } from './db/orm.js'

export const estadosQueBloquean = ['pendiente', 'aprobada']

export type Horario = {
  fecha: string
  horaInicio: string
  horaFin: string
}

export const fechaValida = (fecha: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(new Date(fecha).getTime())

export const horaValida = (hora: string) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(hora)

export async function espaciosPorDisponibilidad(
  horario: Horario,
  modo: 'disponibles' | 'no_disponibles'
) {
  const em = orm.em

  const franjas = await em.find(Disponibilidad, {
    diaSemana: new Date(horario.fecha).getUTCDay(),
    horaInicio: { $lte: horario.horaInicio },
    horaFin: { $gte: horario.horaFin },
  })
  const conFranja = new Set(franjas.map((franja) => franja.espacio.id))

  const reservas = await em.find(Reserva, {
    fecha: horario.fecha,
    estado: { nombre: { $in: estadosQueBloquean } },
    horaInicio: { $lt: horario.horaFin },
    horaFin: { $gt: horario.horaInicio },
  })
  const ocupados = new Set(reservas.map((reserva) => reserva.espacio.id))

  const espacios = await em.find(Espacio, {})

  return espacios.filter((espacio) => {
    const disponible = conFranja.has(espacio.id) && !ocupados.has(espacio.id)
    return modo === 'disponibles' ? disponible : !disponible
  })
}
