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
import { PaginationQueryParamsDto } from "../dto/request.dto";

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
    async findList(@Param('id') id: string, @Query() query: PaginationQueryParamsDto) {
        return this.userService.listMyItems(id, query.limit, query.skip);
    }

    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @Post('list')
    @UsePipes(new ValidationPipe({ transform: true }))
    async addToList(@Body() userListDto: UserListDto) {
        try {
            const list = await this.userService.addToList(userListDto);

            if (list === null) {
                throw new HttpException('Failed to create record. User with given id does not exists', HttpStatusCode.NotFound);
            }

            return list;
        } catch (error) {
            if (error.keyValue && error.keyValue.contentId) {
                throw new HttpException('Content with give ID already exists', HttpStatusCode.BadRequest);
            }

            throw new Error(error);
        }
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
