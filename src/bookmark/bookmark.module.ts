import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity]), GroupModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
