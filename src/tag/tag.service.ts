import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async findOrSave(tag: string, groupId: string): Promise<TagEntity> {
    const previousTag = await this.tagRepository.findOne({ where: { tag } });

    if (previousTag) {
      return previousTag;
    }

    const newTag = new TagEntity();

    newTag.tag = tag;
    newTag.groupId = groupId;

    const result = await this.tagRepository.save(newTag);

    return result;
  }
}
