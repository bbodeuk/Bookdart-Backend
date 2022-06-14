import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from '../user/user.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
