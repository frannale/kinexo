import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // URL de conexión directa (sin pooler) usada por Prisma CLI para migraciones
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
