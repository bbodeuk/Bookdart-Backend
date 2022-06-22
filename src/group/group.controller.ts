import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { GroupService } from './group.service';
import { CreateGroupReq } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async createGroup(
    @Req() req: Request,
    @Body() dto: CreateGroupReq,
  ): Promise<void> {}
}
