import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkReq,
  CreateBookmarkRes,
} from './dto/create-bookmark.dto';
import { Success } from '../common/responses/success';
import { AtGuard } from '../common/guards/at.guard';
import DeleteBookmarkReq from './dto/delete-bookmark.dto';
import { User } from '../@types/users';

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

  @Delete(':bookmarkId')
  @HttpCode(HttpStatus.OK)
  async deleteBookmark(
    @Req() req: Request,
    @Param('bookmarkId') bookmarkId: string,
    @Body() { groupId }: DeleteBookmarkReq,
  ): Promise<Success<null>> {
    const user = req.user as User;

    await this.bookmarkService.deleteBookmark(user, bookmarkId, groupId);

    return new Success(null);
  }
}
