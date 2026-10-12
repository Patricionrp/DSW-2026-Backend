import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Espacio extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: true })
  descripcion?: string

  @Property({ nullable: false })
  capacidad!: number

  @Property({ nullable: false })
  tipo!: string
}
