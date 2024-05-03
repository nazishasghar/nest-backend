import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntities {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    @Exclude()
    readonly id!: bigint

    @Column({ type: 'char', length: 36, unique: true, comment: 'uuid' })
    @ApiProperty()
    uuid!: string

    @DeleteDateColumn({ type: 'datetime', precision: 0, default: null })
    @Exclude()
    @ApiProperty({ type: String })
    readonly deletedAt!: Date | null

    @CreateDateColumn({ type: 'datetime', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    readonly createdAt!: Date

    @UpdateDateColumn({
        type: 'datetime',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    @ApiProperty()
    readonly updatedAt!: Date
}
