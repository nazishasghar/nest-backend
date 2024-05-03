import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Injectable } from '@nestjs/common'

import { AuthService } from '~/client/services/auth/auth.service'
import { UserEntities } from '~/entities/user/user.entities'

/**
 * Email, PasswordでAdminEntitiesを取得するためのStrategy
 */
@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'client') {
    /**
     * constructor
     * @param {AdminAuthService} authService
     */
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'id', passwordField: 'password' })
    }

    /**
     * validate method
     * @param {string} email
     * @param {string} pw
     * @returns {Promise<UserEntities>}
     */
    async validate(email: string, pw: string): Promise<UserEntities> {
        return await this.authService.validateWithEmailAndPassword(email, pw)
    }
}
