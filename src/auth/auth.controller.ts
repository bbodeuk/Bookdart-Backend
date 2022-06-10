import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { User } from '../@types/users';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

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
    const user = await this.userService.findByProviderIdOrSave(
      req.user as User,
    );
    // TODO: 토큰 발급 진행 (JWT)
    // TODO: fix redirect url
    res.redirect('/');
  }
}
