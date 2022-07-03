import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { GroupService } from './group.service';
import { UserEntity } from '../user/user.entity';

describe('groupService', () => {
  let groupService: GroupService;
  let groupRepository: Repository<GroupEntity>;
  const mockedRepository = {
    save: (group) => Promise.resolve({ ...group, id: 'generated-group-id' }),
  };

  const user = new UserEntity();

  const group = {
    user,
    id: 'generated-group-id',
    name: 'group name',
    visibility: 'public',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupEntity),
          useValue: mockedRepository,
        },
      ],
    }).compile();

    groupService = moduleRef.get<GroupService>(GroupService);
    groupRepository = moduleRef.get(getRepositoryToken(GroupEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create group', () => {
    it('should return group id', async () => {
      jest
        .spyOn(groupRepository, 'save')
        .mockResolvedValue({ id: group.id, ...group });

      expect(
        await groupService.create(user, group.name, group.visibility),
      ).toBe(group.id);
    });
  });

  describe('update group', () => {
    beforeEach(() => {
      jest
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(GroupService.prototype as any, 'getOneWithUser')
        .mockReturnValue(group);
    });

    it('should be thrown exception if not owner', async () => {
      jest
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(GroupService.prototype as any, 'isOwner')
        .mockReturnValue(false);

      await expect(
        groupService.updateGroup(user, {
          name: group.name,
          visibility: group.visibility,
          groupId: group.id,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
