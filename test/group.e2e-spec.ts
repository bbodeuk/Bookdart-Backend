import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GroupService } from '../src/group/group.service';

describe('GroupController (e2e)', () => {
  let app: INestApplication;

  const group = {
    id: 'generated-group-uuid',
    name: 'group name',
    visibility: 'public',
  };

  const groupService = {
    create: () => group.id,
  };

  const token = process.env.TEST_TOKEN;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GroupService)
      .useValue(groupService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  it('/groups (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .set('authorization', token)
      .send({ name: group.name, visibility: group.visibility });

    expect(response.statusCode).toEqual(201);
    expect(response.body.groupId).toBeDefined();
  });
});
