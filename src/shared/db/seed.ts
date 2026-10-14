import { orm } from './orm.js'
import { Rol } from '../../rol/rol.entity.js'
import { Estado } from '../../estado/estado.entity.js'

const roles = ['administrador', 'usuario']
const estados = ['pendiente', 'aprobada', 'rechazada', 'cancelada']

export const seed = async () => {
  const em = orm.em.fork()

  for (const nombre of roles) {
    if (!(await em.findOne(Rol, { nombre }))) {
      em.create(Rol, { nombre })
    }
  }


   for (const nombre of estados) {
    if (!(await em.findOne(Estado, { nombre }))) {
      em.create(Estado, { nombre })
    }
  }

  await em.flush()
}