import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { UserCreateDto } from '~/client/dtos/user/user-create.dto'
import { UserEntities } from '~/entities/user/user.entities'
import { UtilsService } from '~/utils/utils.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly utilService: UtilsService,
    ) {}
    static async encodePassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }
    async findOneWithUuid(uuid: string, manager = this.manager): Promise<UserEntities | null> {
        return await manager.findOne(UserEntities, { where: { uuid } })
    }
    async findOneWithEmail(email: string, manager = this.manager): Promise<UserEntities | null> {
        return await manager.findOne(UserEntities, { where: { email } })
    }

    async create(dto: UserCreateDto, manager = this.manager): Promise<UserEntities> {
        if (await manager.findOne(UserEntities, { where: { phoneNumber: dto.phoneNumber } })) {
            throw new BadRequestException('Already exist')
        }
        return await manager.save(
            new UserEntities({
                ...dto,
                uuid: this.utilService.generateUUIDv4(),
                password: await UserService.encodePassword(dto.password),
            }),
        )
    }

    async update(uuid: string, dto: UserCreateDto, manager = this.manager): Promise<UserEntities> {
        const user = await this.findOneWithUuid(uuid, manager)
        if (!user) throw new NotFoundException('User not found')
        return await manager.save(
            this.utilService.objectAssign(user, { ...dto, password: await UserService.encodePassword(dto.password) }),
        )
    }

    async delete(uuid: string, manager = this.manager) {
        const user = await this.findOneWithUuid(uuid, manager)
        if (!user) throw new NotFoundException('User not found')
        return await manager.softDelete(UserEntities, { uuid })
    }
}
