import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/at.strategy';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(payload: JwtPayload): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken, refreshToken };
  }
}
