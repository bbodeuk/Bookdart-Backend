import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { GroupModule } from '../group/group.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity]), GroupModule, TagModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
