import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { BookmarkEntity } from './bookmark.entity';
import { GroupService } from '../group/group.service';
import { User } from '../@types/users';
import { TagService } from '../tag/tag.service';

interface BookmarkMeta {
  title: string;
  description: string;
  image: string;
}

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    private groupService: GroupService,
    private tagService: TagService,
  ) {}

  async createBookmark(
    groupId: string,
    link: string,
    tags: string[],
  ): Promise<BookmarkEntity> {
    const group = await this.groupService.findById(groupId);

    const { title, description, image } = await this.fromLink(link);

    const bookmarkEntity = new BookmarkEntity();
    bookmarkEntity.title = title;
    bookmarkEntity.description = description;
    bookmarkEntity.image = image;
    bookmarkEntity.link = link;
    bookmarkEntity.group = group;

    // TODO: Store tags
    const result = await Promise.all(
      tags.map((tag) => this.tagService.findOrSave(tag, groupId)),
    );

    bookmarkEntity.tags = result;

    const bookmark = await this.bookmarkRepository.save(bookmarkEntity);

    console.log(result);

    return bookmark;
  }

  private async fromLink(link: string): Promise<BookmarkMeta> {
    // TODO: Does it cover any site?
    try {
      const html = await (await fetch(link)).text();
      const $ = cheerio.load(html);

      const title =
        $('meta[property="og:title"]').attr('content') || $('title').text();
      const description =
        $('meta[property="og:description"]').attr('content') || '';
      const image = $('meta[property="og:image"]').attr('content') || '';

      return { title, description, image };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async deleteBookmark(
    user: User,
    bookmarkId: string,
    groupId: string,
  ): Promise<void> {
    const group = await this.groupService.findById(groupId);

    if (group.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    const result = await this.bookmarkRepository
      .createQueryBuilder()
      .delete()
      .from(BookmarkEntity)
      .where('id=:id', { id: bookmarkId })
      .execute();

    if (result.affected === 0) {
      throw new BadRequestException();
    }
  }
}
