import { Module } from '@nestjs/common'
import { ClientControllerModule } from './controllers/client-controller.module'
import { ClientServiceModule } from './services/client-service.module'
import { ClientStrategy } from './auth/strategy/client-strategy'
import { ClientAuthGuard } from './auth/guard/client.guard'
import { PassportModule } from '@nestjs/passport'

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        ClientControllerModule,
        ClientServiceModule,
    ],
    providers: [ClientStrategy, ClientAuthGuard],
})
export class ClientModule {}
