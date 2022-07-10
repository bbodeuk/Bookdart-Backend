import { IsString, IsUUID } from 'class-validator';

export class CreateBookmarkReq {
  @IsString()
  @IsUUID()
  groupId: string;

  @IsString()
  link: string;
}

export class CreateBookmarkRes {
  bookmark: {
    title: string;
    description: string;
    link: string;
    thumnail: string;
  };
}
