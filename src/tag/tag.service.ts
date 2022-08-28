import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { BookmarkEntity } from '../bookmark/bookmark.entity';
import { GetTagsRes } from './dto/get-tags.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
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

  async findByGroupId(groupId: string): Promise<GetTagsRes> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { group: { id: groupId } },
      relations: ['tags'],
    });

    const tagsWithCount = bookmarks.reduce((prev, { tags }) => {
      const tagWithCount = { ...prev };

      tags.forEach(({ tag }) => {
        tagWithCount[tag] = prev[tag] + 1 || 1;
      });

      return tagWithCount;
    }, {});

    const result = Object.keys(tagsWithCount).map((tag) => ({
      tag,
      count: tagsWithCount[tag],
    }));

    // FIXME: Fix logic

    return { tags: result };
  }
}
