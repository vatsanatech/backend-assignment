import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ListService } from './list.service';

import { CreateListDto } from './dto/create-list.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('List')
@Controller('list')
export class UserListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user's list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the user's list",
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async find(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    const result = await this.listService.findAll(userId, paginationDto);
    return { success: true, data: result };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add item to user's list" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item added to the list',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Invalid input or item already exists',
  })
  async create(@Body() addToListDto: CreateListDto) {
    const result = await this.listService.create(addToListDto);
    return { success: true, data: result };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove item from user's list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item removed from the list',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or item not found',
  })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'contentId', required: true, type: String })
  async remove(
    @Query('userId') userId: string,
    @Query('contentId') contentId: string,
  ) {
    if (!userId || !contentId) {
      throw new BadRequestException('userId and contentId are required');
    }
    const result = await this.listService.remove({ userId, contentId });
    return { success: true, data: result };
  }
}
