import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export const CurrentUser = createParamDecorator((payload: 'user' | 'jwtPayload' | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    const key = payload || 'user'
    return req[key]
})
