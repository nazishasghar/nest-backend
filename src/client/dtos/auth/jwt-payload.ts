import { JwtPayload } from 'jsonwebtoken'

export class UserJwtPayload implements JwtPayload {
    uuid!: string
    aud?: string | string[]
    exp?: number
    iat?: number
    iss?: string
    jti?: string
    nbf?: number
    sub?: string

    constructor(args: Readonly<UserJwtPayload>) {
        Object.assign(this, args)
    }
}
