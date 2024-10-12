import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './list.controller';
import { UserService } from './list.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUserDto: CreateUserDto = {
  username: 'testuser',
  favoriteGenres: ['Action'],
  dislikedGenres: ['Romance'],
  watchHistory: [],
  myList: [],
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            addToList: jest.fn(),
            removeFromList: jest.fn(),
            listUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(service, 'addToList').mockResolvedValue(mockUserDto);

      const result = await controller.create(mockUserDto);
      expect(result).toEqual(mockUserDto);
    });

    it('should throw a ConflictException if the user already exists', async () => {
      jest
        .spyOn(service, 'addToList')
        .mockRejectedValue(new ConflictException());

      await expect(controller.create(mockUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'removeFromList').mockResolvedValue(undefined);

      const result = await controller.removeUser('someUserId');
      console.log(JSON.stringify(result));
      expect(result).toEqual({
        statusCode: 200,
        message: 'User with ID someUserId has been successfully deleted.',
        success: true,
      });
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      jest
        .spyOn(service, 'removeFromList')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.removeUser('someUserId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const mockUsers = [mockUserDto];
      jest
        .spyOn(service, 'listUser')
        .mockResolvedValue({ users: mockUsers, next: 1 });

      const result = await controller.findAll(0, 10);
      expect(result).toEqual({ users: mockUsers, next: 1 });
    });
  });
});
