import { Repository } from '../shared/repository.js'
import { Espacio } from './espacio.entity.js'

const espacios: Espacio[] = [
  new Espacio(
    'Aula 204',
    'Aula con proyector',
    40,
    'aula',
    '197b9008-24e0-41c8-96c1-f2abadf6e5c4'
  ),
]

export class EspacioRepository implements Repository<Espacio> {
  public findAll(): Espacio[] | undefined {
    return espacios
  }

  public findOne(item: { id: string }): Espacio | undefined {
    return espacios.find((espacio) => espacio.id === item.id)
  }

  public add(item: Espacio): Espacio | undefined {
    espacios.push(item)
    return item
  }

  public update(item: Espacio): Espacio | undefined {
    const espacioIdx = espacios.findIndex((espacio) => espacio.id === item.id)

    if (espacioIdx !== -1) {
      espacios[espacioIdx] = { ...espacios[espacioIdx], ...item }
    }
    return espacios[espacioIdx]
  }

  public delete(item: { id: string }): Espacio | undefined {
    const espacioIdx = espacios.findIndex((espacio) => espacio.id === item.id)

    if (espacioIdx !== -1) {
      const deletedEspacio = espacios[espacioIdx]
      espacios.splice(espacioIdx, 1)
      return deletedEspacio
    }
  }
}
