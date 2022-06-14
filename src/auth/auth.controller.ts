import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../@types/users';
import { UserService } from '../user/user.service';
import { JwtAuthService } from '../jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtAuthService: JwtAuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line
  async googleAuth(@Req() req: Request): Promise<void> {
    // redirect google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line
    const user = await this.userService.findByProviderIdOrSave(
      req.user as User,
    );

    const accessToken = this.jwtAuthService.login(user);
    res.cookie('access-token', accessToken);

    // FIXME: fix redirect url
    res.redirect('/');
  }
}
