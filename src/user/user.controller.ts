import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    UsePipes,
    ValidationPipe,
    Param,
    Query,
    NotFoundException,
    HttpException,
    HttpStatus,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiFoundResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { User } from "../models/user.schema";
import { UserListDto } from "./dto/user.dto";
import { HttpStatusCode } from "axios";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiResponse({ status: 200, description: 'Fetched user details successfully.' })
    @ApiResponse({ status: 404, description: 'No record found with given id' })
    @Get('/details/:id')
    async find(@Param() params: any): Promise<User> {
        const user = await this.userService.listUser(params.id);

        if (!user) {
            throw new HttpException('No record found with given id', HttpStatusCode.NotFound);
        }

        return user;
    }

    @ApiResponse({ status: 200, description: 'Fetched records successfully.' })
    @Get('list/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async findList(@Param('id') id: string, @Query('limit', ParseIntPipe) limit: number, @Query('skip', ParseIntPipe) skip: number) {
        return this.userService.listMyItems(id, limit, skip);
    }

    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @Post('list')
    @UsePipes(new ValidationPipe({ transform: true }))
    async addToList(@Body() userListDto: UserListDto) {
        const list = await this.userService.addToList(userListDto);

        if (list === null) {
            throw new HttpException('Failed to create record. User with given id does not exists', HttpStatusCode.NotFound);
        }

        return list;
    }

    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'No record found with given id' })
    @Delete('list/:id')
    async removeFromList(@Param('id') id: string) {
        const queryResponse = await this.userService.removeFromList(id);

        if (queryResponse.deletedCount === 0) {
            throw new HttpException('No record found with given id', HttpStatusCode.NotFound);
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'The record has been successfully deleted'
        };
    }
}
