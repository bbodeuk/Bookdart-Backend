import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkReq,
  CreateBookmarkRes,
} from './dto/create-bookmark.dto';
import { Success } from '../common/responses/success';
import { AtGuard } from '../common/guards/at.guard';

@Controller('bookmarks')
@UseGuards(AtGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createBookmark(
    @Body() { groupId, link }: CreateBookmarkReq,
  ): Promise<Success<CreateBookmarkRes>> {
    const { title, description, image } =
      await this.bookmarkService.createBookmark(groupId, link);

    return new Success<CreateBookmarkRes>({
      bookmark: { title, description, image, link },
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteBookmark(
    @Param('bookmarkId') bookmarkId: string,
  ): Promise<Success<null>> {
    await this.bookmarkService.deleteBookmark(bookmarkId);
    return new Success(null);
  }
}
