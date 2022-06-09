import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
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
    // TODO: 유저 정보 확인 (없다면 저장)
    // TODO: 토큰 발급 진행 (JWT)
  }
}
