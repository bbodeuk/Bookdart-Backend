import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forRoot(),
    AuthModule,
    GroupModule,
    BookmarkModule,
  ],
  controllers: [],
  providers: [ConfigService, { provide: 'APP_PIPE', useClass: ValidationPipe }],
})
export class AppModule {}
