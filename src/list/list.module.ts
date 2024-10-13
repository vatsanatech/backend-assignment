import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { User, UserSchema } from 'src/models/user.schema';
import { MoviesService } from 'src/movies/movies.service';
import { TVShowsService } from 'src/tvshows/tvshows.service';
import { Movie, MovieSchema } from '../models/movie.schema';
import { UserListController } from './list.controller';
import { UserListService } from './list.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
      { name: TVShow.name, schema: TVShowSchema },
    ]),
  ],
  controllers: [UserListController],
  providers: [UserListService, MoviesService, TVShowsService],
})
export class UserListModule {}
