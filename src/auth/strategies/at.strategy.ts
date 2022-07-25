import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { decode, verify } from 'jsonwebtoken';
import { JwtPayload } from 'src/@types/auth';
import { User } from 'src/@types/users';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { Token } from '../../@types/auth';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const at = req.headers.authorization.replace('Bearer ', '');
    const now = new Date().getTime();
    const user = await this.userService.findById(id);

    if ((decode(at) as JwtPayload).exp > now) {
      return user;
    }

    const rt = req.cookies['refresh-token'];

    this.checkRefreshToken(rt);
    await this.authService.checkHashedRefreshToken(user.hashedRefreshToken, rt);

    const token = this.getNewToken(payload);

    // TODO: Update refresh token in user
    // await this.userService.updateHashedRefreshToken(id, token.refreshToken);

    // TODO: Change token in cookie

    return user;
  }

  private checkRefreshToken(refreshToken: string) {
    try {
      verify(refreshToken, process.env.JWT_SECRET);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private getNewToken(payload: JwtPayload): Token {
    const token = this.authService.login(payload);
    return token;
  }
}
