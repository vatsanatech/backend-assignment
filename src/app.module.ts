import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from "./seed/seed.module";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    SeedModule
  ],
})
export class AppModule {}
