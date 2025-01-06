import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyList } from '../models/myList.schema';
import {
  CreateUserListItemDto,
  PopulatedContent,
  UserMyList,
} from './dto/list.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as Redis from 'ioredis';

@Injectable()
export class ListRepository {
  private redisClient: Redis.Redis;
  constructor(
    @InjectModel(MyList.name)
    private readonly myListModel: Model<MyList>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.redisClient = (this.cacheManager.store as any).getClient();
  }

  checkMyList(userId: string, content: string): Promise<MyList> {
    return this.myListModel.findOne({ userId, content }).lean();
  }

  async createMyList(
    createUserListItem: CreateUserListItemDto,
  ): Promise<MyList> {
    // Clear cache for the user's list

    const myList = new this.myListModel(createUserListItem);
    await myList.save();
    this.deleteMyListCache(createUserListItem.userId);
    return myList;
  }

  async getMyList(
    userId: string,
    pagination: PaginationDto,
  ): Promise<UserMyList[]> {
    const cacheKey = `userMyList:${userId}:offset:${pagination.offset}:limit:${pagination.limit}`;
    const cachedData = await this.cacheManager.get<UserMyList[]>(cacheKey);

    if (cachedData) {
      // console.log('Cache Hit');
      return cachedData; // Return cached data if available
    }

    // console.log('Cache Miss');
    const myListData = await this.myListModel
      .find({ userId: userId })
      .populate<PopulatedContent>({
        path: 'content', // Path to populate
        select: 'title description', // Fields to include from the Content schema
      })
      .select('content')
      .sort({ createdAt: -1 })
      .skip(pagination.offset)
      .limit(pagination.limit)
      .lean();

    // Extract title and description
    const result = myListData.map((item) => ({
      title: item.content?.title,
      description: item.content?.description,
    }));

    await this.cacheManager.set(cacheKey, result, 3600);

    return result;
  }

  getMyListById(id: string): Promise<MyList> {
    return this.myListModel.findById(id).exec();
  }

  async deleteMyList(userId: string, content: string): Promise<number> {
    const { deletedCount } = await this.myListModel.deleteOne({
      userId,
      content,
    });
    // Clear cache for the user's list
    this.deleteMyListCache(userId);

    return deletedCount;
  }

  async deleteMyListCache(userId: string): Promise<void> {
    const redisClient = (this.cacheManager as any).store.getClient();
    const pattern = `userMyList:${userId}:*`;

    // scans all keys matching the pattern and deletes them
    let cursor = '0';
    do {
      const result = await redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await redisClient.del(...keys); // Delete all matching keys
      }
    } while (cursor !== '0');
  }
}
