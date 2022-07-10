import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';

interface BookmarkMeta {
  title: string;
  description: string;
  thumnail: string;
}

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async createBookmark(groupId: string, link: string): Promise<BookmarkEntity> {
    // TODO: Get group by groupId, and check

    const { title, description, thumnail } = await this.fromLink(link);

    const bookmarkEntity = new BookmarkEntity();
    bookmarkEntity.title = title;
    bookmarkEntity.description = description;
    bookmarkEntity.thumnail = thumnail;
    bookmarkEntity.link = link;

    const bookmark = await this.bookmarkRepository.save(bookmarkEntity);

    return bookmark;
  }

  private async fromLink(link: string): Promise<BookmarkMeta> {
    // TODO: get meta data from link
    // TODO: if incorrect link, reject

    const title = 'title';
    const description = 'description';
    const thumnail = 'thumnail';

    return { title, description, thumnail };
  }
}
