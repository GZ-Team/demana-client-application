import type { JwtPayload } from 'jwt-decode'
import { jwtDecode } from 'jwt-decode'

import useLogger from './loggerUtils'

const { logger } = useLogger({ service: 'Token utils' })

export function decodeJWT(token: string): JwtPayload {
    try {
        return jwtDecode(token)
    } catch (exception) {
        throw new Error(`Failed to decode JWT: ${(exception as Error).message}`)
    }
}

export function isExpiredJWT(token?: string): boolean {
    try {
        if (!token) {
            throw new Error('no token provided')
        }

        const { exp } = decodeJWT(token)

        if (!exp) {
            return false
        }

        const now = new Date()
        const expirationDate = new Date(0)
        expirationDate.setUTCSeconds(exp)

        return expirationDate < now
    } catch (exception) {
        logger.error(`Failed to evaluate JWT expiration: ${(exception as Error).message}`)
        return true
    }
}
