import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GroupService } from '../src/group/group.service';
import { UserService } from '../src/user/user.service';

describe('GroupController (e2e)', () => {
  let app: INestApplication;

  const group = {
    id: 'generated-group-uuid',
    name: 'group name',
    visibility: 'public',
  };

  const user = {
    id: '42b6aa0a-86b4-436c-ada0-34ce499bdb0e',
  };

  const groupService = {
    create: () => group.id,
  };

  const userService = {
    findById: () => user,
  };

  const token = process.env.TEST_TOKEN;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GroupService)
      .useValue(groupService)
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/groups (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .set('authorization', token)
      .send({ name: group.name, visibility: group.visibility });

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data.groupId).toBeDefined();
  });

  it('/groups (POST) Unauthorization', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .send({ name: group.name, visibility: group.visibility });

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/groups (POST) Should have name and visibility', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .set('authorization', token)
      .send({ visibility: group.visibility });

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toEqual('Bad Request Exception');
  });

  it('/groups (POST) visibility should be public or private', async () => {
    const response = await request(app.getHttpServer())
      .post('/groups')
      .set('authorization', token)
      .send({ name: 'group name', visibility: 'ddd' });

    expect(response.statusCode).toEqual(200);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toEqual('Bad Request Exception');
  });
});
