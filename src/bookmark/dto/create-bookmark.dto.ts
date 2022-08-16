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

export class CreateBookmarkRes {
  bookmark: {
    title: string;
    description: string;
    link: string;
    image: string;
  };
}
