import { Module } from '@nestjs/common';
import { TVShowsService } from './tvshows.service';
import { TVShowsController } from './tvshows.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from '../models/content.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]), // Register Content model with Mongoose
  ],
  controllers: [TVShowsController],
  providers: [TVShowsService],
})
export class TvshowsModule {}
