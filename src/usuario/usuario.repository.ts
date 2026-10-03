import { Repository } from '../shared/repository.js'
import { Usuario } from './usuario.entity.js'

const usuarios: Usuario[] = []

export class usuarioRepository implements Repository<Usuario> {
  public findAll(): Usuario[] {
    return usuarios
  }

  public findOne(item: { id: string }): Usuario | undefined {
    return usuarios.find((usuario) => usuario.id === item.id)
  }

  public add(item: Usuario): Usuario {
    usuarios.push(item)
    return item
  }

  public update(item: Usuario): Usuario | undefined {
    const usuarioIdx = usuarios.findIndex(
      (usuario) => usuario.id === item.id
    )

    if (usuarioIdx === -1) {
      return undefined
    }

    usuarios[usuarioIdx] = { ...usuarios[usuarioIdx], ...item }
    return usuarios[usuarioIdx]
  }

  public delete(item: { id: string }): Usuario | undefined {
    const usuarioIdx = usuarios.findIndex(
      (usuario) => usuario.id === item.id
    )

    if (usuarioIdx === -1) {
      return undefined
    }

    const usuarioEliminado = usuarios[usuarioIdx]
    usuarios.splice(usuarioIdx, 1)
    return usuarioEliminado
  }
}