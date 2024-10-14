import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

describe('UserListController (e2e)', () => {
  let app: INestApplication;
  let newListItemId = '';
  let userId = '';
  let userModel: Model<any>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    userModel = moduleFixture.get<Model<any>>(getModelToken('User'));

    // Find or create a test user
    const testUser = await findOrCreateTestUser();
    userId = testUser._id.toString();
  });

  afterAll(async () => {
    // Clean up test user
    await cleanupTestUser(userId);
    await app.close();
  });

  const findOrCreateTestUser = async () => {
    const existingUser = await userModel.findOne({
      email: 'testuser@example.com',
    });
    if (existingUser) {
      return existingUser;
    }

    const newUser = new userModel({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });
    return await newUser.save();
  };

  const cleanupTestUser = async (userId: string) => {
    await userModel.findByIdAndDelete(userId);
  };

  it('/api/list (POST)', () => {
    const body = {
      contentId: new Types.ObjectId().toString(),
      contentType: 'Movie',
      userId: userId,
    };

    return request(app.getHttpServer())
      .post('/api/list')
      .send(body)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(expect.any(Array));
        newListItemId =
          response.body.data[response.body.data.length - 1].contentId;
      });
  });

  it('/api/list (GET)', () => {
    const url = `/api/list?userId=${userId}`;

    return request(app.getHttpServer())
      .get(url)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(expect.any(Array));
      });
  });

  it('/api/list (DELETE)', () => {
    const body = {
      userId: userId,
      contentId: newListItemId,
    };

    return request(app.getHttpServer())
      .delete('/api/list')
      .send(body)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(expect.any(Array));
      });
  });
});
