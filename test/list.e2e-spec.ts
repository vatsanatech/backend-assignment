import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SeedService } from '../src/seed/seed.service';

describe('ListController (e2e)', () => {
  let app: INestApplication;
  let seedService: SeedService;

  let userId: string;
  let contentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    seedService = moduleFixture.get(SeedService);

    await app.init();

    // Seed the database and retrieve IDs
    await seedService.seedDatabase();
    const user = await seedService['userModel']
      .findOne({ username: 'user1' })
      .lean();
    const content = await seedService['contentModel']
      .findOne({ title: 'Breaking Bad' })
      .lean();

    userId = user._id.toString();
    contentId = content._id.toString();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add an item to the user list', async () => {
    const payload = { userId, content: contentId };

    await request(app.getHttpServer()).post('/list').send(payload).expect(201);
  });

  it('should fetch the user list with pagination', async () => {
    const pagination = { offset: 0, limit: 10 };

    const response = await request(app.getHttpServer())
      .get(
        `/list?userId=${userId}&offset=${pagination.offset}&limit=${pagination.limit}`,
      )
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Breaking Bad',
          description: expect.any(String),
        }),
      ]),
    );
  });

  it('should not add duplicate items to the list', async () => {
    const payload = { userId, content: contentId };

    const response = await request(app.getHttpServer())
      .post('/list')
      .send(payload)
      .expect(400);

    expect(response.body.message).toBe(
      'This item is already in your watch list.',
    );
  });

  it('should remove an item from the user list', async () => {
    const payload = { userId, content: contentId };

    await request(app.getHttpServer())
      .delete('/list')
      .send(payload)
      .expect(200);
  });

  it('should return an error when trying to remove a non-existent item', async () => {
    const payload = { userId, content: 'nonexistentContentId' };

    const response = await request(app.getHttpServer())
      .delete('/list')
      .send(payload)
      .expect(500);

    expect(response.body.message).toBe('Internal server error');
  });
});
