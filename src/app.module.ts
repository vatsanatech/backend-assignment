import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from './seed/seed.module';
import { ListModule } from './list/list.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as Redis from 'cache-manager-ioredis';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/stagedb', // can use from env
    ), 
    MoviesModule,
    TvshowsModule,
    SeedModule,
    ListModule,
    CacheModule.register({
      store: Redis as Redis.Redis,
      host: 'localhost',
      port: 6379,
      ttl: 3600,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
