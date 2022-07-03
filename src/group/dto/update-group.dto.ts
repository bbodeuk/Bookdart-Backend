import { IsIn, IsString } from 'class-validator';

export class UpdateGroupReq {
  @IsString()
  name?: string;

  @IsIn(['public', 'private', undefined])
  visibility?: string;
}

export class UpdateGroupRes {
  group: {
    id: string;
    name: string;
    visibility: string;
  };
}
