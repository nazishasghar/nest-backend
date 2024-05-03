import { type ClientJwtPayload } from '~/client/dto/auth/client-jwt-payload'
import { UserEntities } from '~/entities/user/user.entities'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FastifyUser {}

declare module 'fastify' {
    interface FastifyRequest {
        user?: UserEntities
        jwtPayload?: ClientJwtPayload
        policy?: string
        policyName?: string
    }
}
