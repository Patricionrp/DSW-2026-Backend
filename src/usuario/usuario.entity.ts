import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/decorators/legacy'
import type { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Rol } from '../rol/rol.entity.js'

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: false })
  apellido!: string

  @Property({ nullable: false })
  @Unique()
  email!: string

  @ManyToOne(() => Rol, { nullable: false })
  rol!: Rel<Rol>
}