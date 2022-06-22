import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GroupService } from './group.service';
import { CreateGroupReq } from './dto/create-group.dto';
import { AtGuard } from '../common/guards/at.guard';
import { UserEntity } from '../user/user.entity';

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(AtGuard)
  async createGroup(
    @Req() req: Request,
    @Body() dto: CreateGroupReq,
  ): Promise<string> {
    const user = req.user as UserEntity;
    const { name, visibility } = dto;

    const groupId = await this.groupService.create(user, name, visibility);

    return groupId;
  }
}
