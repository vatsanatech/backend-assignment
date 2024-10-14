import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
import { Movie, MovieSchema } from '../models/movie.schema';
import { UserListController } from './list.controller';
import { ListService } from './list.service';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TVShow.name, schema: TVShowSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
    SeedModule,
  ],
  controllers: [UserListController],
  providers: [ListService],
})
export class ListModule {}
