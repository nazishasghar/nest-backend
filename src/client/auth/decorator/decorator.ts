import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AdminCurrentUserGuard } from '~/client/auth/current-user/current-user.guard'

export const ClientAuth = (
    { currentUser = false }: { currentUser?: boolean } = {
        currentUser: false,
    },
) =>
    applyDecorators(
        SetMetadata('current-user', currentUser),
        UseGuards(AdminCurrentUserGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    )
