import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from '../models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async addToList(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();

    if (existingUser) {
      throw new ConflictException(
        `User with username ${createUserDto.username} already exists.`,
      );
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async removeFromList(userId: string) {
    const result = await this.userModel.findByIdAndDelete(userId);

    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  }

  async listMyItems() {
    throw new Error('Method not implemented.');
  }

  async listUser({
    offset = 0,
    limit = 10,
  }: {
    offset: number;
    limit: number;
  }): Promise<{ users: CreateUserDto[]; next: number }> {
    const users = await this.userModel.find().skip(offset).limit(limit).exec();
    return {
      users: users as CreateUserDto[],
      next: users.length + offset,
    };
  }
}
