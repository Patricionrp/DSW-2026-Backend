import { Entity, Property, Unique } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Estado extends BaseEntity {
  @Property({ nullable: false })
  @Unique()
  nombre!: string
}