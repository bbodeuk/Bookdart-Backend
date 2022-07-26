import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CookieInterceptor } from './common/interceptors/cookie-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new CookieInterceptor());
  await app.listen(3000);
}
bootstrap();
