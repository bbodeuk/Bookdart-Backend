import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { BookmarkEntity } from './bookmark.entity';
import { GroupService } from '../group/group.service';

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
  ) {}

  async createBookmark(groupId: string, link: string): Promise<BookmarkEntity> {
    const group = await this.groupService.findById(groupId);

    const { title, description, image } = await this.fromLink(link);

    const bookmarkEntity = new BookmarkEntity();
    bookmarkEntity.title = title;
    bookmarkEntity.description = description;
    bookmarkEntity.image = image;
    bookmarkEntity.link = link;
    bookmarkEntity.group = group;

    const bookmark = await this.bookmarkRepository.save(bookmarkEntity);

    return bookmark;
  }

  private async fromLink(link: string): Promise<BookmarkMeta> {
    // TODO: Does it cover any site?
    try {
      const html = await (await fetch(link)).text();
      const $ = cheerio.load(html);

      const title = $('meta[property="og:title"]').attr('content');
      const description = $('meta[property="og:description"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');

      return { title, description, image };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
