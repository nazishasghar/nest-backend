import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UserService } from '~/client/services/user/user.service'
import { ClientAuth } from '~/client/auth/decorator/decorator'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserEntities } from '~/entities/user/user.entities'
import { UserCreateDto } from '~/client/dtos/user/user-create.dto'

@Controller('user')
@ApiTags('UserController')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':uuid')
    @ApiOperation({ summary: 'Get user with uuid' })
    @ApiParam({ type: String, name: 'uuid' })
    @ApiResponse({ type: () => UserEntities, status: 200 })
    @ClientAuth({ currentUser: true })
    async getUser(@Param('uuid') uuid: string): Promise<UserEntities | null> {
        return await this.userService.findOneWithUuid(uuid)
    }

    @Post()
    @ApiOperation({ summary: 'create user' })
    @ApiBody({ type: () => UserCreateDto })
    @ApiResponse({ type: () => UserEntities, status: 200 })
    async create(@Body() dto: UserCreateDto): Promise<UserEntities> {
        return await this.userService.create(dto)
    }

    @Put(':uuid')
    @ApiParam({ type: String, name: 'uuid' })
    @ApiOperation({ summary: 'update user' })
    @ApiBody({ type: () => UserCreateDto })
    @ApiResponse({ type: () => UserEntities, status: 200 })
    async update(@Param('uuid') uuid: string, @Body() dto: UserCreateDto): Promise<UserEntities> {
        return await this.userService.update(uuid, dto)
    }

    @Delete(':uuid')
    @ApiParam({ type: String, name: 'uuid' })
    @ApiOperation({ summary: 'create user' })
    @ApiBody({ type: () => UserCreateDto })
    @ApiResponse({ type: () => UserEntities, status: 200 })
    @ClientAuth({ currentUser: true })
    async delete(@Param('uuid') uuid: string) {
        return await this.userService.delete(uuid)
    }
}
