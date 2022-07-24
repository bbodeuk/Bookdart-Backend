export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface JwtPayloadWithRT extends JwtPayload {
  refreshToken: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}
