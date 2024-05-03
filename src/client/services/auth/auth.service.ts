import { ConfigService } from '@nestjs/config'
import { InjectEntityManager } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { EntityManager } from 'typeorm'
import { instanceToPlain } from 'class-transformer'
import { UserEntities } from '~/entities/user/user.entities'
import { UserJwtPayload } from '../../dtos/auth/jwt-payload'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ClientAuthTokenResponseDto } from '../../dtos/auth/client-auth-token-response.dto'
import { UtilsService } from '~/utils/utils.service'
import { UserRefreshTokenEntities } from '~/entities/user-refresh-token/user-refresh-token.entities'
import { CustomerRefreshTokenRepository } from 'src/repository/user-refresh-token.repository'
import { UserRepository } from '~/repository/user.repository'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        readonly jwtService: JwtService,
        readonly utilService: UtilsService,
        readonly configService: ConfigService,
    ) {}

    async signIn(user: UserEntities) {
        const iss = this.configService.get<string>('JWT_ISS')!
        return await this.jwtService.signAsync(
            instanceToPlain(
                new UserJwtPayload({
                    uuid: user.uuid,
                    sub: 'UserAccessToken',
                    iss,
                    aud: [iss],
                }),
            ),
        )
    }
    /**
     * JWTトークンを検証
     * @param token
     */
    async validateToken(token: string): Promise<UserJwtPayload> {
        const iss = this.configService.get<string>('JWT_ISS')!

        return await this.jwtService.verifyAsync<UserJwtPayload>(token, {
            issuer: iss,
            subject: 'ClientAccessToken',
        })
    }

    /**
     * JWTトークンを生成してレスポンスオブジェクトを作成
     * @param customer
     * @param manager
     */
    async generateToken(customer: UserEntities, manager = this.manager): Promise<ClientAuthTokenResponseDto> {
        const refreshToken = await this.generateRefreshToken(customer, manager)
        const token = await this.signIn(customer)

        return new ClientAuthTokenResponseDto({
            access_token: token,
            refresh_token: refreshToken,
            token_type: 'bearer',
            expires_in: 30 * 60,
        })
    }
    /**
     * リフレッシュトークンを生成
     * @param customer
     * @param claimType
     * @param manager
     */
    async generateRefreshToken(customer: UserEntities, manager = this.manager): Promise<string> {
        const refreshTokenRepository = CustomerRefreshTokenRepository(manager)
        const token = this.utilService.generateRandomToken(120)
        await refreshTokenRepository.save(
            new UserRefreshTokenEntities({
                uuid: this.utilService.generateUUIDv4(),
                user: customer,
                token,
            }),
        )

        return token
    }
    /**
     * リフレッシュトークンを検証
     * @param token
     * @param claimType
     * @param manager
     */
    async validateRefreshToken(token: string, manager = this.manager): Promise<boolean> {
        const refreshTokenRepository = CustomerRefreshTokenRepository(manager)
        const refreshToken = await refreshTokenRepository.findOneWithToken(token)
        return !!refreshToken
    }

    /**
     * emailとpasswordで認証
     * @param email
     * @param password
     * @param manager
     */
    async validateWithEmailAndPassword(email: string, password: string, manager = this.manager): Promise<UserEntities> {
        const userRepository = UserRepository(manager)
        const admin = await userRepository.findOneWithEmail(email)

        if (!admin) throw new NotFoundException('user not found')

        const result = await AuthService.validatePassword(password, admin.password)
        if (!result) throw new BadRequestException('password is wrong')

        return admin
    }

    static async validatePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(password, hash)
    }
}
