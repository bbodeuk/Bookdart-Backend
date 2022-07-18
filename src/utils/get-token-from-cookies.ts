import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export default function getTokenFromCookies(req: Request): string {
  const token = req.cookies['refresh-token'];

  if (!token) {
    throw new UnauthorizedException();
  }

  return token;
}
