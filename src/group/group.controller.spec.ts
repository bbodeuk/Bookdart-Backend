import { Test } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService],
    }).compile();

    groupService = moduleRef.get<GroupService>(GroupService);
    groupController = moduleRef.get<GroupController>(GroupController);
  });

  describe('createGroup', () => {
    it('should be defined createGroup', () => {
      expect(groupController.createGroup).toBeDefined();
    });
  });
});
