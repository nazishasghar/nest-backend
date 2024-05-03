import { type FastifyRequest } from 'fastify'

/**
 * authorizationヘッダーからbearerを取得
 * @param {Request} request
 * @param authScheme
 * @returns {string | null}
 */
export const getBearerToken = (request: FastifyRequest, authScheme = 'bearer'): string | undefined => {
    const headerValue = request.headers['x-authorization'] || request.headers['authorization']
    if (headerValue) {
        const auth_params = (headerValue as string).match(/(\S+)\s+(\S+)/)
        if (auth_params && authScheme === auth_params[1].toLowerCase()) {
            return auth_params[2]
        }
    }
    return undefined
}
