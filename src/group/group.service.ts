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
import { FindAllRes } from './dto/findAll-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}

  async findAllByUserId(userId: string, page: number): Promise<FindAllRes> {
    // FIXME: Remove Magic number and Set number per page.
    const take = 9;
    const skip = (page - 1) * take;

    const [groups, count] = await this.groupRepository.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      skip,
      take,
      order: {
        created: 'DESC',
      },
    });

    const hasNext = skip + take < count;

    return { groups, pagination: { page, hasNext } };
  }

  async findById(groupId: string): Promise<GroupEntity> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new ForbiddenException();
    }

    return group;
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
    const group = await this.getOneWithUser(groupId);

    if (!this.isOwner(user, group)) {
      throw new UnauthorizedException();
    }

    group.name = name || group.name;
    group.visibility = visibility || group.visibility;

    const updatedGroup = await this.groupRepository.save(group);
    return updatedGroup;
  }

  private async getOneWithUser(groupId: string): Promise<GroupEntity> {
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
