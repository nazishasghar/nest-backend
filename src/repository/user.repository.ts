import { UserEntities } from '~/entities/user/user.entities'
import { EntityManager, Repository } from 'typeorm'

export const UserRepository = (manager: EntityManager) =>
    new Repository(UserEntities, manager).extend({
        async findOneWithUuid(uuid: string): Promise<UserEntities | null> {
            return this.findOne({
                where: {
                    uuid: uuid,
                },
            })
        },

        async findOneWithEmail(email: string): Promise<UserEntities | null> {
            return this.findOne({
                where: {
                    email,
                },
            })
        },
    })
