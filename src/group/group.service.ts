import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/@types/users';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}

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
      name: string | undefined;
      visibility: string | undefined;
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
