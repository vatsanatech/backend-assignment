import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './list.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';

@ApiTags('list')
@Controller('list')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return this.userService.listUser({
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.addToList(createUserDto);
  }
  @Delete(':userId')
  async removeUser(@Param('userId') userId: string) {
    await this.userService.removeFromList(userId);
    return {
      statusCode: HttpStatus.OK,
      message: `User with ID ${userId} has been successfully deleted.`,
      success: true,
    };
  }
}
