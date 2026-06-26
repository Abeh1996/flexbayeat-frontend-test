import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  sub: string;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  return decodeToken(token)?.role ?? null;
}