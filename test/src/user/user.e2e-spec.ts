import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from "../../../src/models/user.schema";
import { Movie } from "../../../src/models/movie.schema";
import { AppModule } from "../../../src/app.module";

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let newListItemId = '';
    let userId = '';
    let movieId = '';
    let userModel: Model<User>;
    let movieModel: Model<Movie>;

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

        userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
        movieModel = moduleFixture.get<Model<Movie>>(getModelToken('Movie'));

        // Find or create a test user
        const testUser = await findOrCreateTestUser();
        userId = testUser._id.toString();

        // Create a test movie
        const testMovie = await createTestMovie();
        movieId = testMovie._id.toString();
    });

    afterAll(async () => {
        // Clean up test user and movie
        await cleanupTestUser(userId);
        if (movieId) {
            await cleanupTestMovie(movieId);
        }
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

    const createTestMovie = async () => {
        const newMovie = new movieModel({
            title: 'Test Movie',
            description: 'This is a test movie',
            releaseYear: 2023,
            genre: ['Test'],
            director: 'Test Director',
            releaseDate: new Date(),
            // Add any other required fields here
        });
        return await newMovie.save();
    };

    const cleanupTestUser = async (userId: string) => {
        await userModel.findByIdAndDelete(userId);
    };

    const cleanupTestMovie = async (movieId: string) => {
        await movieModel.findByIdAndDelete(movieId);
    };

    it('/user/list (POST) - should add item to list', async () => {
        const body = {
            contentId: movieId,
            contentType: 'Movie',
            userId: userId,
        };

        const response = await request(app.getHttpServer())
            .post('/user/list')
            .send(body)
            .expect(201)
            .expect('Content-Type', 'application/json');

        expect(response.body).toContain('_id')
        expect(response.body.userId).toEqual(userId);
        expect(response.body.contentId).toBe(movieId);
    });

    it('/user/list (POST) - should not add duplicate item', async () => {
        const body = {
            contentId: movieId,
            contentType: 'Movie',
            userId: userId,
        };

        await request(app.getHttpServer()).post('/user/list').send(body).expect(400);
    });

    it('/user/list (POST) - should return 400 for invalid content type', async () => {
        const body = {
            contentId: movieId,
            contentType: 'InvalidType',
            userId: userId,
        };

        await request(app.getHttpServer()).post('/user/list').send(body).expect(400);
    });

    it('/user/list (GET) - should return list with pagination', async () => {
        const response = await request(app.getHttpServer())
            .get(`/user/list?userId=${userId}&limit=5&offset=0`)
            .expect(200)
            .expect('Content-Type', 'application/json');

        expect(response.body).toEqual(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({
                        contentId: movieId,
                        contentType: 'Movie',
                    }),
                ]),
                total: expect.any(Number)
            }),
        );
    });

    it('/user/list/:id (GET) - should return 400 for invalid pagination params', async () => {
        await request(app.getHttpServer())
            .get(`/user/list/${userId}?&limit=-1&offset=-1`)
            .expect(400);
    });

    it('/user/list/:id (DELETE) - should remove item from list', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/user/list/${userId}?contentId=${movieId}`)
            .expect(200)
            .expect('Content-Type', 'application/json');

        expect(response.body.statusCode).toBe(200);
    });

    it('/user/list/:id (DELETE) - should return 404 for non-existent item', async () => {
        await request(app.getHttpServer())
            .delete(
                `/user/list/${userId}?contentId=${new Types.ObjectId().toString()}`,
            )
            .expect(404);
    });
});
