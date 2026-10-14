import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy'
import { types } from '@mikro-orm/core'
import type { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'
import { Estado } from '../estado/estado.entity.js'

@Entity()
export class Reserva extends BaseEntity {
  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>

  @ManyToOne(() => Espacio, { nullable: false })
  espacio!: Rel<Espacio>

  @ManyToOne(() => Estado, { nullable: false })
  estado!: Rel<Estado>

  @Property({ type: types.date, nullable: false })
  fecha!: string

  @Property({ type: types.time, nullable: false })
  horaInicio!: string

  @Property({ type: types.time, nullable: false })
  horaFin!: string
}