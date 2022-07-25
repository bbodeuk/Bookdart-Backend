export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}
