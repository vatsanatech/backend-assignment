import {
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  Body,
  Delete,
} from '@nestjs/common';
import { UserListService } from './list.service';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserListItemDto, RemoveUserListItemDto } from './dto/list.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('User List')
@Controller('list')
export class UserListController {
  constructor(private readonly userListService: UserListService) {}

  @Get() // TODO: add DTO
  fetchUserList(
    @Query('userId') userId: string, // will use JWT to fetch userId
    @Query() paginationDto: PaginationDto,
  ) {
    if (!userId) {
      throw new BadRequestException('USERID NOT FOUND');
    }
    return this.userListService.fetchUserList(userId, paginationDto);
  }

  @Post()
  create(@Body() payload: CreateUserListItemDto) {
    return this.userListService.addToUserList(payload);
  }

  @Delete()
  removeContentFromList(@Body() payload: RemoveUserListItemDto) {
    return this.userListService.removeFromUserList(payload);
  }
}
