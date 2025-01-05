import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from './seed/seed.module';
import { ListModule } from './list/list.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    SeedModule,
    ListModule,
  ],
})
export class AppModule {}
