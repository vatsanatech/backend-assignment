import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import {
  CreateUserListItemDto,
  RemoveUserListItemDto,
  UserMyList,
} from './dto/list.dto';
import { ListRepository } from './list.repository';

@Injectable()
export class UserListService {
  constructor(
    @Inject(ListRepository)
    private readonly listRepository: ListRepository,
  ) {}

  async addToUserList(itemDetails: CreateUserListItemDto): Promise<string> {
    const { content, userId } = itemDetails;
    const existingItem = await this.listRepository.checkMyList(userId, content);
    if (existingItem) {
      throw new BadRequestException('This item is already in your watch list.');
    }
    await this.listRepository.createMyList(itemDetails);
    return `Added to watchlist successfully`;
  }

  fetchUserList(id: string, pagination: PaginationDto): Promise<UserMyList[]> {
    return this.listRepository.getMyList(id, pagination);
  }

  async removeFromUserList(payload: RemoveUserListItemDto): Promise<string> {
    const { userId, content } = payload;
    const deletedCount = await this.listRepository.deleteMyList(
      userId,
      content,
    );
    if (deletedCount === 0) {
      throw new BadRequestException('Item not found in your watch list.');
    }
    return `Removed from watchlist successfully  ${content}`;
  }
}
