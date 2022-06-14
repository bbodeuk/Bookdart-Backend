import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login({ email, id }: { email: string; id: string }): string {
    const payload: JwtPayload = { email, id };

    // TODO: Using refresh-token
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
