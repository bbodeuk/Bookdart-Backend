export interface JwtPayload {
  id: string;
  email: string;
}

export interface JwtPayloadWithRT extends JwtPayload {
  refreshToken: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
