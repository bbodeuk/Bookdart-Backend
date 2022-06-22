import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { createRequest, MockRequest } from 'node-mocks-http';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;
  let req: MockRequest<Request>;
  let user: { id: string; email: string };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService],
    }).compile();

    groupService = moduleRef.get<GroupService>(GroupService);
    groupController = moduleRef.get<GroupController>(GroupController);

    req = createRequest();
    user = { id: 'generated-uuid-user', email: 'email@email.com' };
    req.user = user;
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
        user.id,
        group.name,
        group.visibility,
      );
    });

    it('should be returned groupId', async () => {
      const groupId = 'generated-group-uuid';

      jest.spyOn(groupService, 'create').mockResolvedValue(groupId);

      expect(await groupController.createGroup(req, group)).toBe(groupId);
    });
  });
});
