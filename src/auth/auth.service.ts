import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from 'src/@types/auth';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(payload: JwtPayload): Tokens {
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
