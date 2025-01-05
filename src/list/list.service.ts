import { BadRequestException, Injectable,Inject } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';
import { WatchList, WatchListDocument } from 'src/models/watchList.schema';
import {
  CreateUserListItemDto,
  RemoveUserListItemDto,
} from './dto/user-list.dto';

import {ListRepository } from './list.repository';


@Injectable()
export class UserListService {
  constructor(
    @InjectModel(WatchList.name)
    private readonly watchListModel: Model<WatchListDocument>,

    @Inject(ListRepository)
    private readonly listRepository: ListRepository,
  ) {}

  async addToUserList(itemDetails: CreateUserListItemDto) {
    const { contentId, contentType, userId } = itemDetails;

    let existingItem = await this.watchListModel.findOne({
      userId,
      contentId,
      contentType,
    });
    if (existingItem) {
      throw new BadRequestException('This item is already in your watch list.');
    }
    const watchItem = new this.watchListModel(itemDetails);
    await watchItem.save();
    return 'Added to Watch list.';
  }

  async fetchUserList(id: string, pagination: PaginationDto) {
    return await this.listRepository.getWatchList(id, pagination);
  }

  removeFromUserList(payload: RemoveUserListItemDto) {
    return this.watchListModel.deleteOne(payload);
  }
}
