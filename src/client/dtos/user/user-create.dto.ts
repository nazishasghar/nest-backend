import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator'

export class UserCreateDto {
    @ApiProperty({ name: 'name', type: String, required: true })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ name: 'password', type: String, required: true })
    @IsString()
    @IsNotEmpty()
    password!: string

    @ApiProperty({ name: 'email', type: String, required: true })
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @ApiProperty({ name: 'phoneNumber', type: String, required: true })
    @IsNotEmpty()
    @IsPhoneNumber('JP')
    phoneNumber!: string
}
