import { jwtDecode } from 'jwt-decode';

import type { JwtPayload } from 'jwt-decode';

export function decodeJWT(token: string): JwtPayload {
  try {
    return jwtDecode(token);
  } catch (exception) {
    throw new Error(`Failed to decode JWT: ${(exception as Error).message}`);
  }
}
