import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/@types/users';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';
import { BookmarkEntity } from '../bookmark/bookmark.entity';
import { FindOneRes } from '../../dist/src/group/dto/findone-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async findById(groupId: string): Promise<GroupEntity> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new ForbiddenException();
    }

    return group;
  }

  async findGroupWithBookmarks(
    user: User,
    groupId: string,
    page: number,
  ): Promise<FindOneRes> {
    const group = await this.findOneWithUser(groupId);

    if (!this.isOwner(user, group)) {
      throw new UnauthorizedException();
    }

    // FIXME: Fix magic number and Set count per a page.
    const take = 9;
    const skip = (page - 1) * take;

    const [bookmarks, count] = await this.bookmarkRepository.findAndCount({
      where: { group: { id: groupId } },
      skip,
      take,
      // FIXME: Get order query
      order: {
        created: 'DESC',
      },
    });

    const hasNext = skip + take < count;

    const pagination = {
      page,
      hasNext,
    };

    return { bookmarks, pagination };
  }

  async create(
    user: UserEntity,
    name: string,
    visibility: string,
  ): Promise<string> {
    // TODO: verify group's name
    const group = new GroupEntity();

    group.user = user;
    group.name = name;
    group.visibility = visibility;

    const newGroup = await this.groupRepository.save(group);

    return newGroup.id;
  }

  async updateGroup(
    user: User,
    {
      name,
      visibility,
      groupId,
    }: {
      name?: string;
      visibility?: string;
      groupId: string;
    },
  ): Promise<GroupEntity> {
    const group = await this.findOneWithUser(groupId);

    if (!this.isOwner(user, group)) {
      throw new UnauthorizedException();
    }

    group.name = name || group.name;
    group.visibility = visibility || group.visibility;

    const updatedGroup = await this.groupRepository.save(group);
    return updatedGroup;
  }

  private async findOneWithUser(groupId: string): Promise<GroupEntity> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.user', 'user')
      .where('group.id=:groupId', { groupId })
      .getOne();

    return group;
  }

  private isOwner(user: User, group: GroupEntity): boolean {
    return user.id === group.user.id;
  }
}
