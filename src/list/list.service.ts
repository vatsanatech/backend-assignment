import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserListService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<any[]> {
    const validOffset = Number.isNaN(Number(offset)) ? 0 : Number(offset);
    const validLimit = Number.isNaN(Number(limit)) ? 10 : Number(limit);

    const result = await this.userModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        { $unwind: '$myList' },
        { $skip: validOffset },
        { $limit: validLimit },
        {
          $lookup: {
            from: 'movies',
            let: { contentId: { $toObjectId: '$myList.contentId' } }, // Convert contentId to ObjectId
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$contentId'] } } }],
            as: 'movieContent',
          },
        },
        {
          $lookup: {
            from: 'tvshows',
            let: { contentId: { $toObjectId: '$myList.contentId' } }, // Convert contentId to ObjectId
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$contentId'] } } }],
            as: 'tvShowContent',
          },
        },
        {
          $addFields: {
            content: {
              $cond: {
                if: { $eq: ['$myList.contentType', 'Movie'] },
                then: { $arrayElemAt: ['$movieContent', 0] },
                else: { $arrayElemAt: ['$tvShowContent', 0] },
              },
            },
          },
        },
        {
          $project: {
            _id: '$myList._id',
            contentId: '$myList.contentId',
            contentType: '$myList.contentType',
            content: 1, // Project content field
          },
        },
      ])
      .exec();

    if (result.length === 0) {
      throw new NotFoundException('User not found or list is empty');
    }

    return result;
  }

  async create(addToListDto): Promise<User['myList']> {
    const { contentId, contentType, userId } = addToListDto;

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const itemIndex = user.myList.findIndex(
      (item) => item.contentId === contentId,
    );

    if (itemIndex !== -1) {
      throw new BadRequestException('Item already exists in the list');
    }

    user.myList.push({ contentId, contentType });

    await user.save();
    return user.myList;
  }

  async remove(userId: string, contentId: string): Promise<User['myList']> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const itemIndex = user.myList.findIndex(
      (item) => item.contentId === contentId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in the list');
    }

    user.myList.splice(itemIndex, 1);

    await user.save();
    return user.myList;
  }
}
