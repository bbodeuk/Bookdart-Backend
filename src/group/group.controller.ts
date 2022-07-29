import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { UpdateGroupReq, UpdateGroupRes } from './dto/update-group.dto';
import { FindOneRes } from '../../dist/src/group/dto/findone-group.dto';

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

  @Get(':groupId')
  @HttpCode(HttpStatus.OK)
  async findOneGroup(
    @Req() req: Request,
    @Param('groupId') groupId: string,
  ): Promise<Success<FindOneRes>> {
    const user = req.user as User;
    const page = Number(req.query.page) || 1;

    const { bookmarks, pagination } =
      await this.groupService.findGroupWithBookmarks(user, groupId, page);

    return new Success({ bookmarks, pagination });
  }

  @Patch(':groupId')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Req() req: Request,
    @Body() { name, visibility }: UpdateGroupReq,
  ): Promise<Success<UpdateGroupRes>> {
    const user = req.user as User;
    const { groupId } = req.params;

    const newGroup = await this.groupService.updateGroup(user, {
      groupId,
      name,
      visibility,
    });

    return new Success<UpdateGroupRes>({
      group: {
        id: groupId,
        name: newGroup.name,
        visibility: newGroup.visibility,
      },
    });
  }
}
