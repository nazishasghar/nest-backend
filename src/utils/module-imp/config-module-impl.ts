import type { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import * as dotenv from 'dotenv'

dotenv.config({ path: `./config/.env` })

export const getConfigModuleImplementation = (): DynamicModule =>
    ConfigModule.forRoot({
        envFilePath: ['./config/.env'],
        validationSchema: Joi.object({
            DB_URL: Joi.string(),
            JWT_KEY: Joi.string(),
            CORS: Joi.boolean(),
            HTTPS: Joi.boolean(),
        }),
        validationOptions: {
            allowUnknown: true,
            abortEarly: true,
        },
        expandVariables: true,
        isGlobal: true,
    })
