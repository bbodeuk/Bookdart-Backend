import { IsIn, IsString } from 'class-validator';

export class UpdateGroupReq {
  @IsString()
  name?: string;

  @IsIn(['public', 'private', undefined])
  visibility?: string;
}
