import { IsString, IsUUID } from 'class-validator';

export default class DeleteBookmarkReq {
  @IsString()
  @IsUUID()
  groupId: string;
}
