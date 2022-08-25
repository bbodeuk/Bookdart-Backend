import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getTagsByGroupId(@Query('groupId') groupId: string): Promise<void> {
    await this.tagService.findByGroupId(groupId);
    throw new Error('Not Implement');
  }
}
