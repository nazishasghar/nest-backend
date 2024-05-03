import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

import * as path from 'path'
import { CustomNamingStrategy } from './custom-naming-strategy'
dotenv.config({ path: `./config/.env` })

const DB_URL = process.env['DB_URL']!.replace('\\\\$', '$')
export const AppDataSource = new DataSource({
    type: 'mysql',
    url: DB_URL,
    synchronize: false,
    entities: [path.resolve(__dirname, `entities/**/*.entities.{ts,js}`)],
    migrations: [path.resolve(__dirname, `db/migration/**/*.{ts,js}`)],
    subscribers: [path.resolve(__dirname, `db/subscribers/**/*.{ts,js}`)],
    charset: 'utf8mb4',
    timezone: '+09:00',
    dateStrings: ['DATE', 'TIME'],
    supportBigNumbers: true,
    namingStrategy: new CustomNamingStrategy(),
})
