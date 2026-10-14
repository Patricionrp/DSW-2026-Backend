import { MikroORM } from '@mikro-orm/mysql'
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

process.loadEnvFile()

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: ReflectMetadataProvider,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  highlighter: new SqlHighlighter(),
  debug: true,
})

export const syncSchema = async () => {
  await orm.schema.update() //never in production
}
