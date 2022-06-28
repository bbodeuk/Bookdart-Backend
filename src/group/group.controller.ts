import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/@types/users';
import { AtGuard } from '../common/guards';
import { GroupService } from './group.service';
import { UserEntity } from '../user/user.entity';
import { Success } from '../common/responses/success';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CreateGroupReq, CreateGroupRes } from './dto/create-group.dto';
import { UpdateGroupReq } from './dto/update-group.dto';

@Controller('groups')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AtGuard)
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createGroup(
    // TODO: Fix req to user by using decorator
    @Req() req: Request,
    @Body() { name, visibility }: CreateGroupReq,
  ): Promise<Success<CreateGroupRes>> {
    const user = req.user as UserEntity;
    const groupId = await this.groupService.create(user, name, visibility);

    return new Success<CreateGroupRes>({ groupId });
  }

  @Patch(':groupId')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Req() req: Request,
    @Body() { name, visibility }: UpdateGroupReq,
  ): Promise<void> {
    const user = req.user as User;
    const { groupId } = req.params;

    await this.groupService.updateGroup(user, { groupId, name, visibility });
  }
}
