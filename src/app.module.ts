import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
  ],
})
export class AppModule {}
