import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
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
const sqliteURL = process.env.DATABASE_URL || 'file:./deeksha-cms.db'
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const db = mongoURL
  ? mongooseAdapter({
      url: mongoURL,
    })
  : sqliteAdapter({
      client: {
        url: sqliteURL,
      },
      migrationDir: path.resolve(dirname, 'src/migrations'),
      prodMigrations: migrations,
      push: true,
    })

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
