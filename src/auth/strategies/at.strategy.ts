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
    const { authorization } = req.headers;
    const { token: accessToken } =
      this.getTokenFromAuthorizationHeader(authorization);
    const now = new Date().getTime() / 1000;
    const user = await this.userService.findById(id);

    if (now < this.getExpirationInToken(accessToken)) {
      return user;
    }

    const refreshToken = req.cookies['refresh-token'];

    this.checkRefreshToken(refreshToken);
    await this.authService.checkHashedRefreshToken(
      user.hashedRefreshToken,
      refreshToken,
    );

    const token = this.getNewToken(payload);
    await this.userService.updateHashedRefreshToken(id, token.refreshToken);

    req.cookies.isRefresh = true;
    req.cookies['access-token'] = token.accessToken;
    req.cookies['refresh-token'] = token.refreshToken;

    return user;
  }

  private getTokenFromAuthorizationHeader(authorization: string) {
    const [type, token] = authorization.split(' ');
    return { type, token };
  }

  private getExpirationInToken(token: string) {
    return (decode(token) as JwtPayload).exp;
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
