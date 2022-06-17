import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/@types/auth';
import { User } from 'src/@types/users';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): Partial<User> {
    return payload;
  }
}
