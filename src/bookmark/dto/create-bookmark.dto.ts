import { IsString, IsUUID } from 'class-validator';
import { Bookmark } from '../../@types/bookmark';

export class CreateBookmarkReq {
  @IsString()
  @IsUUID()
  groupId: string;

  @IsString()
  link: string;

  @IsString({ each: true })
  tags: string[];
}

export class CreateBookmarkRes {
  bookmark: Omit<Bookmark, 'tags'>;
}
