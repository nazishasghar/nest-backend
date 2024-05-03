import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'
import { getConfigModuleImplementation } from './utils/module-imp/config-module-impl'
import { ClientModule } from './client/client.module'
import { CustomNamingStrategy } from './custom-naming-strategy'

@Module({
    imports: [
        getConfigModuleImplementation(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DB_URL')!.replace('\\$', '$')
                return {
                    type: 'mysql',
                    url: dbUrl,
                    entities: [path.resolve(__dirname, 'entities/**/*.entities.{ts,js}')],
                    synchronize: false,
                    timezone: '+09:00',
                    dateStrings: ['DATE', 'TIME'],
                    extra: {
                        connectionLimit: 10,
                    },
                    supportBigNumbers: true,
                    autoLoadEntities: true,
                    namingStrategy: new CustomNamingStrategy(),
                }
            },
        }),
        ClientModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
