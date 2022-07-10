import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { GroupService } from '../group/group.service';

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
    private groupService: GroupService,
  ) {}

  async createBookmark(groupId: string, link: string): Promise<BookmarkEntity> {
    const group = await this.groupService.findById(groupId);

    const { title, description, thumnail } = await this.fromLink(link);

    const bookmarkEntity = new BookmarkEntity();
    bookmarkEntity.title = title;
    bookmarkEntity.description = description;
    bookmarkEntity.thumnail = thumnail;
    bookmarkEntity.link = link;
    bookmarkEntity.group = group;

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
