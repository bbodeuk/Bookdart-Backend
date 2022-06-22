import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { createRequest, MockRequest } from 'node-mocks-http';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../user/user.entity';

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;
  let req: MockRequest<Request>;
  let user: UserEntity;

  const groupRepository = {
    save: (group) => Promise.resolve({ ...group, id: 'generated-group-id' }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        GroupService,
        { provide: getRepositoryToken(GroupEntity), useValue: groupRepository },
      ],
    }).compile();

    groupService = moduleRef.get<GroupService>(GroupService);
    groupController = moduleRef.get<GroupController>(GroupController);

    req = createRequest();
    user = new UserEntity();
    req.user = user;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGroup', () => {
    const group = {
      name: 'group name',
      visibility: 'public',
    };

    it('should be defined createGroup', () => {
      expect(groupController.createGroup).toBeDefined();
    });

    it('should be called create with userId, groupName and visibility', async () => {
      jest.spyOn(groupService, 'create');

      await groupController.createGroup(req, group);

      expect(groupService.create).toBeCalledWith(
        user,
        group.name,
        group.visibility,
      );
    });

    it('should be returned groupId', async () => {
      const groupId = 'generated-group-uuid';

      jest.spyOn(groupService, 'create').mockResolvedValue(groupId);

      expect(await groupController.createGroup(req, group)).toEqual({
        groupId,
      });
    });
  });
});
