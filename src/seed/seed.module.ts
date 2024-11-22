import { Module } from '@nestjs/common';
import { SeedController } from "./seed.controller";
import { SeedService } from "./seed.service";
import { Movie, MovieSchema } from "../models/movie.schema";
import { User, UserSchema } from "../models/user.schema";
import { TVShow, TVShowSchema } from "../models/tvshow.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
