import { Module } from '@nestjs/common'
import { UserController } from './user/user.controller'
import { UtilModule } from '~/utils/utils.module'
import { ClientServiceModule } from '../services/client-service.module'
import { AuthController } from './auth/auth.controller'

@Module({
    imports: [UtilModule, ClientServiceModule],
    controllers: [UserController, AuthController],
})
export class ClientControllerModule {}
