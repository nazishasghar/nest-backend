import { Column, Entity, Index, JoinColumn, ManyToOne, Relation } from 'typeorm'
import { Exclude } from 'class-transformer'
import { UserEntities } from '../user/user.entities'
import { BaseEntities } from '~/utils/typeorm/base.entities'
import { OmitAndPickPartial } from 'src/type/common'

@Entity()
@Exclude()
export class UserRefreshTokenEntities extends BaseEntities {
    @Column({ type: 'varchar', length: 63 })
    @Index()
    token!: string

    @ManyToOne(() => UserEntities)
    @JoinColumn()
    user?: Relation<UserEntities>

    @Column({ nullable: true, type: 'bigint' })
    adminId?: bigint

    constructor(partial: OmitAndPickPartial<UserRefreshTokenEntities, keyof Omit<BaseEntities, 'uuid'>, never>) {
        super()
        Object.assign(this, partial)
    }
}
