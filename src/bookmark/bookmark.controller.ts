import { Body, Controller, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkReq,
  CreateBookmarkRes,
} from './dto/create-bookmark.dto';
import { Success } from '../common/responses/success';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  async createBookmark(
    @Body() { groupId, link }: CreateBookmarkReq,
  ): Promise<Success<CreateBookmarkRes>> {
    const bookmark = await this.bookmarkService.createBookmark(groupId, link);

    return new Success<CreateBookmarkRes>({ bookmark });
  }
}
