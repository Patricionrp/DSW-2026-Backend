import { Repository} from '../shared/repository.js'
import { Reserva } from './reserva.entity.js'

const reservas: Reserva[] = []

export class ReservaRepository implements Repository <Reserva> {
  public findAll(): Reserva[] {
    return reservas
  }

  public findOne(item: { id: string}) : Reserva | undefined {
    return reservas.find((reserva) => reserva.id === item.id)
  }

  public add(item: Reserva): Reserva {
    reservas.push(item)
    return item
  }

  public update(item: Partial <Reserva> & { id: string }): Reserva | undefined {
    const reservaIdx = reservas.findIndex((reserva) => reserva.id === item.id)

    if (reservaIdx !== -1) {
      reservas[reservaIdx] = { ...reservas[reservaIdx], ...item }
    }
    return reservas[reservaIdx]
  } 

  public delete(item: { id: string }): Reserva | undefined {
    const reservaIdx = reservas.findIndex((reserva) => reserva.id === item.id)

    if (reservaIdx !== -1){
      const deletedReserva = reservas[reservaIdx]
      reservas.splice(reservaIdx, 1)
      return deletedReserva 
    }
  }
} 

