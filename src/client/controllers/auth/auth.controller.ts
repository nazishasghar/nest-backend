import { Controller, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ClientAuthGuard } from '~/client/auth/guard/client.guard'
import { ClientAuthTokenResponseDto } from '~/client/dtos/auth/client-auth-token-response.dto'
import { AuthService } from '~/client/services/auth/auth.service'
import { UserService } from '~/client/services/user/user.service'
import { UserEntities } from '~/entities/user/user.entities'
import { CurrentUser } from '~/utils/fastify/current-user'

export class ClientLoginDto {
    @ApiProperty({ type: String })
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    password!: string
}

export class ClientRefrestTokenDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    refreshToken!: string
}

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
    constructor(
        readonly configService: ConfigService,
        readonly authService: AuthService,
        readonly userService: UserService,
    ) {}
    @Post('signin/password')
    @ApiOperation({ summary: 'パスワードでサインイン' })
    @ApiBody({ type: () => ClientLoginDto })
    @ApiResponse({ type: () => ClientAuthTokenResponseDto, status: 200 })
    @UseGuards(ClientAuthGuard)
    async signinWithId(@CurrentUser('user') user: UserEntities): Promise<ClientAuthTokenResponseDto> {
        return await this.authService.generateToken(user)
    }

    @Post('refresh')
    @ApiOperation({ summary: 'リフレッシュトークンからアクセストークンを再生成' })
    @ApiBody({
        type: () => ClientRefrestTokenDto,
    })
    @ApiResponse({ type: String, status: 200 })
    @UseGuards(ClientAuthGuard)
    async refreshToken(@CurrentUser('user') user: UserEntities): Promise<string> {
        return await this.authService.generateRefreshToken(user)
    }
}
