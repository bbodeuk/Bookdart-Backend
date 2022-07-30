import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { BookmarkEntity } from '../bookmark/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, BookmarkEntity])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
