// This is list repostory file, where we will write all the database related operations. and read from watchList schema

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WatchList } from '../models/watchList.schema';
import { CreateUserListItemDto } from './dto/user-list.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ListRepository {
  constructor(
    @InjectModel(WatchList.name)
    private readonly watchListModel: Model<WatchList>,
  ) {}

  async createWatchList(
    CreateUserListItemDto: CreateUserListItemDto,
  ): Promise<WatchList> {
    const watchList = new this.watchListModel(CreateUserListItemDto);
    return watchList.save();
  }

  async getWatchList(
    id: string,
    pagination: PaginationDto,
  ): Promise<WatchList[]> {
    return await this.watchListModel
      .find({ userId: id })
      .populate('contentId','title')
      .sort({ createdAt: -1 })
      .skip(pagination.offset)
      .limit(pagination.limit)
      .lean();
  }

  async getWatchListById(id: string): Promise<WatchList> {
    return this.watchListModel.findById(id).exec();
  }

  async updateWatchList(
    id: string,
    CreateUserListItemDto: CreateUserListItemDto,
  ): Promise<WatchList> {
    return this.watchListModel
      .findByIdAndUpdate(id, CreateUserListItemDto, { new: true })
      .exec();
  }

  async deleteWatchList(id: string): Promise<WatchList> {
    return this.watchListModel.findByIdAndDelete(id).exec();
  }
}
