import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from 'src/@types/auth';
import { User } from 'src/@types/users';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { id }: JwtPayload): Promise<User> {
    const at = req.headers.authorization.replace('Bearer ', '');
    const now = new Date().getTime();

    if ((decode(at) as JwtPayload).exp < now) {
      // TODO: Check refresh token and new
      throw new Error();
    }

    const user = await this.userService.findById(id);
    return user;
  }
}
