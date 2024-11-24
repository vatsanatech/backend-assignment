import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from "./seed/seed.module";
import configuration from "./config/configuration";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodbUrl')
      }),
      inject: [ConfigService],
    }),
    MoviesModule,
    TvshowsModule,
    SeedModule,
    UserModule
  ],
})
export class AppModule { }
