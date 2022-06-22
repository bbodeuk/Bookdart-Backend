import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupReq {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['public', 'private'])
  visibility: string;
}

export class CreateGroupRes {
  groupId: string;
}
