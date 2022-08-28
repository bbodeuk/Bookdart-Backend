import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { BookmarkEntity } from '../bookmark/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, BookmarkEntity])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
