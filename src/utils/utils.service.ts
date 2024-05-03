import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { v4 as uuidV4 } from 'uuid'

@Injectable()
export class UtilsService {
    generateRandomToken(length = 25): string {
        const size = Math.ceil(length / 2)
        return crypto.randomBytes(size).toString('hex').substring(0, size)
    }
    generateUUIDv4(): string {
        return uuidV4()
    }

    objectAssign = <T extends object>(entity: T, properties: Partial<T>): T => {
        Object.keys(properties).forEach((key) => {
            if (key in entity) {
                entity[key as keyof T] = properties[key as keyof Partial<T>] as T[keyof T]
            }
        })
        return entity
    }
}
