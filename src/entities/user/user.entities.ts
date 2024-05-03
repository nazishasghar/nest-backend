import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { BaseEntities } from '~/utils/typeorm/base.entities'
import { OmitAndPickPartial } from 'src/type/common'
import { Column, Entity } from 'typeorm'

@Entity()
export class UserEntities extends BaseEntities {
    @Column({ type: 'varchar', length: 50 })
    @ApiProperty({ type: String, description: 'name of user' })
    name!: string

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty({ type: String, description: 'phone number of user' })
    phoneNumber!: string

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty({ type: String, description: 'email of user' })
    email!: string

    @Column({ length: 255 })
    @Exclude()
    password!: string

    constructor(args: OmitAndPickPartial<UserEntities, keyof Omit<BaseEntities, 'uuid'>, never>) {
        super()
        Object.assign(this, args)
    }
}
