import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from '@fastify/helmet'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { camelCase } from 'typeorm/util/StringUtils'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Travel Haggle')
        .setDescription('A travel booking platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    app.setGlobalPrefix('v1/api')
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
        operationIdFactory(controllerKey: string, methodKey: string) {
            return `${camelCase(controllerKey.replace('Controller', ''))}${
                methodKey[0].toUpperCase() + camelCase(methodKey).slice(1)
            }`
        },
    })
    SwaggerModule.setup('api/swagger', app, document)

    const config = app.get(ConfigService)
    const isEnabledHTTPS = config.get<boolean>('HTTPS')!

    // バリデーションの設定
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // classに変換する (Dateなどの型の自動変換は無いです)
            whitelist: true, // class内に存在する値だけのオブジェクトを作成する
            // forbidNonWhitelisted: true, // classに無い要素が含まれていた場合にエラーを返す
        }),
    )

    const reflector = app.get(Reflector)

    // シリアライズ時の処理の設定
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

    const isEnabledCORS = config.get<boolean>('CORS')!
    app.enableCors({
        origin: isEnabledCORS,
        allowedHeaders:
            'Origin,X-Requested-With,Content-Type,Accept,Date,Content-Length,Authorization,X-Request-ID,X-Authorization',
        preflightContinue: false,
    })

    const fastify = await app.register(helmet, {
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        hsts: isEnabledHTTPS,
    })

    fastify.addHook('onRequest', async (request, reply) => {
        if (isEnabledHTTPS) reply.header('Content-Security-Policy', 'upgrade-insecure-requests')

        reply.header('x-xss-protection', '1; mode=block')
    })

    await app.listen(3000)
}
bootstrap()
