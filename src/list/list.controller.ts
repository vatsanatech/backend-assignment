import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Request,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UserListService } from './list.service';

import { CreateListDto } from './dto/create-list.dto';

@ApiTags('List')
@Controller('list')
@ApiBearerAuth()
export class ListController {
  constructor(private readonly userListService: UserListService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user's list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the user's list",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User's list not found",
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async find(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('userId') userId: string,
  ) {
    try {
      const list = await this.userListService.findAll(userId, limit, offset);
      return list;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add item to user's list" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item added to the list',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or item already exists',
  })
  async create(@Body() addToListDto: CreateListDto) {
    try {
      const updatedList = await this.userListService.create(addToListDto);
      return updatedList;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove item from user's list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item removed from the list',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'List or item not found',
  })
  @ApiParam({ name: 'itemId', type: String })
  async remove(@Param('itemId') itemId: string, @Request() req) {
    try {
      const updatedList = await this.userListService.remove(
        req.user.userId,
        itemId,
      );
      return updatedList;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
