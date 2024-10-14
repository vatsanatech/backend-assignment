import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { PaginationDto } from './dto/pagination.dto';
import { CreateListDto } from './dto/create-list.dto';
import { TVShow } from 'src/models/tvshow.schema';
import { Movie } from 'src/models/movie.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async findAll(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    items: any[];
    total: number;
    offset: number;
    limit: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto;
    const validOffset =
      Number.isNaN(Number(offset)) || Number(offset) < 0 ? 0 : Number(offset);
    const validLimit =
      Number.isNaN(Number(limit)) || Number(limit) < 1 ? 10 : Number(limit);

    const [result, totalCount] = await Promise.all([
      this.userModel
        .aggregate([
          { $match: { _id: new Types.ObjectId(userId) } },
          { $unwind: '$myList' },
          { $skip: validOffset },
          { $limit: validLimit },
          {
            $lookup: {
              from: 'movies',
              let: { contentId: '$myList.contentId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toString: '$_id' }, '$$contentId'],
                    },
                  },
                },
              ],
              as: 'movieContent',
            },
          },
          {
            $lookup: {
              from: 'tvshows',
              let: { contentId: '$myList.contentId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toString: '$_id' }, '$$contentId'],
                    },
                  },
                },
              ],
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
              content: 1,
            },
          },
        ])
        .exec(),
      this.userModel
        .aggregate([
          { $match: { _id: new Types.ObjectId(userId) } },
          { $project: { count: { $size: '$myList' } } },
        ])
        .exec(),
    ]);

    const total = totalCount[0]?.count || 0;

    return {
      items: result,
      total,
      offset: validOffset,
      limit: validLimit,
    };
  }

  async create(addToListDto: CreateListDto): Promise<User['myList']> {
    const { contentId, contentType, userId } = addToListDto;

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (contentType !== 'TVShow' && contentType !== 'Movie') {
      throw new BadRequestException(
        'Invalid content type. Must be either TVShow or Movie.',
      );
    }

    let content;
    try {
      if (contentType === 'TVShow') {
        content = await this.tvShowModel.findById(contentId).exec();
      } else {
        content = await this.movieModel.findById(contentId).exec();
      }
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching content');
    }

    if (!content) {
      throw new NotFoundException(
        `${contentType} with id ${contentId} not found`,
      );
    }

    const itemExists = user.myList.some(
      (item) =>
        item.contentId === contentId && item.contentType === contentType,
    );

    if (itemExists) {
      throw new ConflictException('Item already exists in the list');
    }

    user.myList.push({ contentId, contentType });

    await user.save();
    return user.myList;
  }

  async remove({ userId, contentId }): Promise<User['myList']> {
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
