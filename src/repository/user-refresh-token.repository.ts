import { UserRefreshTokenEntities } from '~/entities/user-refresh-token/user-refresh-token.entities'
import { EntityManager, Repository } from 'typeorm'
import { v4 } from 'uuid'

export const CustomerRefreshTokenRepository = (manager: EntityManager) =>
    new Repository(UserRefreshTokenEntities, manager).extend({
        async insertWith(token: string, type: 'client' | 'admin'): Promise<UserRefreshTokenEntities> {
            return await this.save({
                uuid: v4(),
                token,
                type,
            })
        },

        async findOneWithToken(token: string): Promise<UserRefreshTokenEntities | null> {
            return this.findOne({
                where: {
                    token,
                },
            })
        },
    })
