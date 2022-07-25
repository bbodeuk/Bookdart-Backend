import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/@types/users';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // redirect google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userService.findByProviderIdOrSave(
      req.user as User,
    );

    const payload = { id: user.id, email: user.email };

    const { accessToken, refreshToken } = this.authService.login(payload);
    res.cookie('access-token', accessToken);
    res.cookie('refresh-token', refreshToken);

    await this.userService.updateHashedRefreshToken(user.id, refreshToken);

    // FIXME: fix redirect url
    res.redirect('/');
  }
}
