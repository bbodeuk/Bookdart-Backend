import { IsString, IsUUID } from 'class-validator';

export class CreateBookmarkReq {
  @IsString()
  @IsUUID()
  groupId: string;

  @IsString()
  link: string;

  @IsString({ each: true })
  tags: string[];
}
