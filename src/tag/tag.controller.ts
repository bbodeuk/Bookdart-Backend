import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { Success } from '../common/responses/success';
import { GetTagsRes } from './dto/get-tags.dto';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getTagsByGroupId(
    @Query('groupId') groupId: string,
  ): Promise<Success<GetTagsRes>> {
    const tags = await this.tagService.findByGroupId(groupId);
    return new Success(tags);
  }
}
