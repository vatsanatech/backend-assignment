import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserListService } from './list.service';

import {
  AddToListDto,
  ListUserItemDto,
  RemoveFromListDto,
} from './dto/list-user.dto';
import { MoviesService } from 'src/movies/movies.service';
import { TVShowsService } from 'src/tvshows/tvshows.service';
import { MovieNotExistException } from 'src/movies/exception/movie.exception';
import { TVShowDoesNotExistException } from 'src/tvshows/exception/tvShow.exception';
import { successResponse } from 'src/utils/successResponse';
import {
  ContentAlreadyExistsException,
  ContentDoesNotException,
  UserNotFoundException,
} from './exceptions/list.exception';

@ApiTags('User List')
@Controller('list')
export class UserListController {
  constructor(
    private readonly userListService: UserListService,
    private readonly moviesService: MoviesService,
    private readonly tvShowService: TVShowsService,
  ) {}

  @Get(':userId')
  async findMyItems(@Param() params: ListUserItemDto) {
    const { userId } = params;
    const foundContent = await this.userListService.listMyItems(userId);
    return successResponse(HttpStatus.OK, 'Found Content', foundContent);
  }

  @Post()
  async create(@Body() payload: AddToListDto) {
    const { contentId, contentType, userId } = payload;

    // check if user exists
    const foundUser = await this.userListService.listMyItems(userId);

    if (!foundUser) {
      throw new UserNotFoundException();
    }

    // check if the movie exists, in case of a movie
    if (contentType === 'Movie') {
      const foundMovie = await this.moviesService.findOne(contentId);
      if (!foundMovie) {
        throw new MovieNotExistException();
      }
    }

    // check if the TV Show exists, in case of a TV Show
    if (contentType === 'TVShow') {
      const foundTvShow = await this.tvShowService.findOne(contentId);
      if (!foundTvShow) {
        throw new TVShowDoesNotExistException();
      }
    }

    const contentAlreadyAdded = await this.userListService.findUserItem(
      userId,
      contentId,
    );

    //check if the content is already added to the user list
    if (contentAlreadyAdded) {
      throw new ContentAlreadyExistsException();
    }

    const updatedUserList = await this.userListService.addToList(payload);

    return successResponse(
      HttpStatus.ACCEPTED,
      'Content Added Successfully',
      updatedUserList,
    );
  }

  @Delete()
  async removeContentFromList(@Body() payload: RemoveFromListDto) {
    const { userId, contentId } = payload;

    const foundUser = await this.userListService.listMyItems(userId);

    // check if user exists
    if (!foundUser) {
      throw new UserNotFoundException();
    }

    const noContentAdded = await this.userListService.findUserItem(
      userId,
      contentId,
    );

    //check if the content to be removed exists or not
    if (!noContentAdded) {
      throw new ContentDoesNotException();
    }

    const updatedUserList = await this.userListService.removeFromList(
      userId,
      contentId,
    );

    return successResponse(
      HttpStatus.ACCEPTED,
      'Content Removed Successfully',
      updatedUserList,
    );
  }
}
