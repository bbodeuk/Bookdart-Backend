import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RtGuard } from '../common/guards';
import { User } from '../@types/users';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtAuthService: AuthService,
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

    const { accessToken, refreshToken } = this.jwtAuthService.login(payload);
    res.cookie('access-token', accessToken);
    res.cookie('refresh-token', refreshToken);

    await this.userService.updateHashedRefreshToken(user.id, refreshToken);

    // FIXME: fix redirect url
    res.redirect('/');
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    // TODO: 유저 정보 조회
    // TODO: refresh token 비교
    // TODO: true ? send at, rt : remove refresh token and reject (redirect login)
  }
}
