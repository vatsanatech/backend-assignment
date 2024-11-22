import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Episode, EpisodeSchema } from './episode.schema';
import { genre } from '../constants/constants';

export type TVShowDocument = TVShow & Document;

@Schema()
export class TVShow {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  genres: string[];

  @Prop({ type: [EpisodeSchema], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);

TVShowSchema.index({ title: 1});
TVShowSchema.index({ description: 1});
TVShowSchema.index({ genres: 1});
TVShowSchema.searchIndex({
  name: 'Search index for TVShow collection',
  definition: {
    mappings: {
      dynamic: true,
    }
  }
});
