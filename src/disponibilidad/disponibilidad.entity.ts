import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy'
import { types } from '@mikro-orm/core'
import type { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Espacio } from '../espacio/espacio.entity.js'

@Entity()
export class Disponibilidad extends BaseEntity {
  @ManyToOne(() => Espacio, { nullable: false })
  espacio!: Rel<Espacio>

  @Property({ nullable: false })
  diaSemana!: number

  @Property({ type: types.time, nullable: false })
  horaInicio!: string

  @Property({ type: types.time, nullable: false })
  horaFin!: string
}
