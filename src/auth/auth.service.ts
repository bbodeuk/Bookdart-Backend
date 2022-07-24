import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { JwtPayload, Token } from 'src/@types/auth';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(payload: Partial<JwtPayload>): Token {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '14d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken, refreshToken };
  }

  async checkHashedRefreshToken(hashed: string, token: string): Promise<void> {
    const isHashedTrue = await argon2.verify(hashed, token);

    if (!isHashedTrue) {
      // FIXME: Throw error or redirect login
      throw new UnauthorizedException();
    }
  }
}
