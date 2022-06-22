import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AtGuard } from '../common/guards';
import { GroupService } from './group.service';
import { CreateGroupReq, CreateGroupRes } from './dto/create-group.dto';
import { UserEntity } from '../user/user.entity';

@Controller('groups')
@UseGuards(AtGuard)
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async createGroup(
    @Req() req: Request,
    @Body() dto: CreateGroupReq,
  ): Promise<CreateGroupRes> {
    const user = req.user as UserEntity;
    const { name, visibility } = dto;

    const groupId = await this.groupService.create(user, name, visibility);

    return { groupId };
  }
}
