import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/@types/auth';
import { User } from 'src/@types/users';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JwtPayload): Promise<User> {
    const user = await this.userService.findById(id);

    return user;
  }
}
