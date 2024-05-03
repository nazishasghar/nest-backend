import { Module } from '@nestjs/common'
import { UtilModule } from '~/utils/utils.module'
import { UserService } from './user/user.service'
import { getJwtModuleImpl } from '~/utils/module-imp/get-jwt-module-impl'
import { AuthService } from './auth/auth.service'

@Module({
    imports: [UtilModule, getJwtModuleImpl()],
    providers: [UserService, AuthService],
    exports: [UserService, AuthService],
})
export class ClientServiceModule {}
