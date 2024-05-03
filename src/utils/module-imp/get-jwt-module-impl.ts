import { DynamicModule, Module } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

export const getJwtModuleImpl = () =>
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            return {
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: '30m',
                    algorithm: 'HS256',
                },
            }
        },
    })

@Module({})
export class DynamicJwtModule {
    static forRootAsync(options: {
        inject: unknown[]
        useFactory: (...args: ConfigService[]) => Promise<JwtModuleOptions> | JwtModuleOptions
    }): DynamicModule {
        const jwtModuleAsync = JwtModule.registerAsync(options)

        return {
            module: DynamicJwtModule,
            imports: [jwtModuleAsync],
            exports: [jwtModuleAsync],
        }
    }
}
