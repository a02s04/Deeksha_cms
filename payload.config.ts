import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { Customers } from './src/collections/Customers.ts'
import { Media } from './src/collections/Media.ts'
import { Orders } from './src/collections/Orders.ts'
import { Portfolio } from './src/collections/Portfolio.ts'
import { Products } from './src/collections/Products.ts'
import { Users } from './src/collections/Users.ts'
import { SiteSettings } from './src/globals/SiteSettings.ts'
import { migrations } from './src/migrations/index.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const mongoURL = process.env.DATABASE_URI || process.env.MONGODB_URI
const postgresURL = process.env.POSTGRES_URL || process.env.DATABASE_URL_POSTGRES
const sqliteURL = process.env.DATABASE_URL || 'file:./deeksha-cms.db'
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const getDB = () => {
  if (mongoURL) {
    return mongooseAdapter({ url: mongoURL })
  }
  if (postgresURL) {
    return postgresAdapter({
      pool: { connectionString: postgresURL },
      push: false,
      migrationDir: path.resolve(dirname, 'src/migrations'),
    })
  }
  return sqliteAdapter({
    client: { url: sqliteURL },
    migrationDir: path.resolve(dirname, 'src/migrations'),
    prodMigrations: migrations,
    push: false,
  })
}

const db = getDB()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Deeksha CMS',
    },
  },
  collections: [Users, Media, Products, Portfolio, Customers, Orders],
  cors: [serverURL],
  csrf: [serverURL],
  db,
  editor: lexicalEditor(),
  globals: [SiteSettings],
  graphQL: {
    disable: true,
  },
  routes: {
    admin: '/admin',
    api: '/api',
  },
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  serverURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
