import { orm } from './orm.js'
import { Rol } from '../../rol/rol.entity.js'


const roles = ['administrador', 'usuario']


export const seed = async () => {
  const em = orm.em.fork()

  for (const nombre of roles) {
    if (!(await em.findOne(Rol, { nombre }))) {
      em.create(Rol, { nombre })
    }
  }

  await em.flush()
}