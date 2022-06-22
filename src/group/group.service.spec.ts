import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
    const user = new UserEntity();

    const group = {
      user,
      name: 'group name',
      visibility: 'public',
    };

    const groupId = 'generated-group-id';

    it('should be defined create', () => {
      expect(groupService.create).toBeDefined();
    });

    it('should be called groupRepository.save with group', async () => {
      const saveSpy = jest.spyOn(groupRepository, 'save');

      await groupService.create(user, group.name, group.visibility);

      expect(saveSpy).toBeCalledWith(group);
    });

    it('should return group id', async () => {
      jest
        .spyOn(groupRepository, 'save')
        .mockResolvedValue({ id: groupId, ...group });

      expect(
        await groupService.create(user, group.name, group.visibility),
      ).toBe(groupId);
    });
  });
});
