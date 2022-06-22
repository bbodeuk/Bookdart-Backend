import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const group = new GroupEntity();

    group.user = user;
    group.name = name;
    group.visibility = visibility;

    const newGroup = await this.groupRepository.save(group);

    return newGroup.id;
  }
}
