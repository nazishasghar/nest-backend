import { Injectable, CanActivate, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../../services/auth/auth.service'
import { FastifyRequest } from 'fastify'
import { getBearerToken } from '~/utils/fastify/get-bearer-token'
import { TokenExpiredError } from 'jsonwebtoken'
import { UserService } from '~/client/services/user/user.service'

@Injectable()
export class AdminCurrentUserGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        readonly authService: AuthService,
        readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: FastifyRequest = context.switchToHttp().getRequest()
        const token = getBearerToken(req)

        if (!token) return false

        try {
            req.jwtPayload = await this.authService.validateToken(token)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new BadRequestException('bad request')
            }
            throw new BadRequestException('bad request')
        }

        const isGetCurrentUser = this.reflector.get<boolean | undefined>('current-user', context.getHandler())
        if (isGetCurrentUser) {
            const user = await this.userService.findOneWithUuid(req.jwtPayload.uuid)
            if (!user) throw new NotFoundException('user not found')

            req.user = user
        }
        return true
    }
}
