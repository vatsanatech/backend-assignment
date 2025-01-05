import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CONTENT_TYPE, genre } from '../constants/constants';
import { Episode, EpisodeSchema } from './episode.schema';

export type ContentDocument = Content & Document;

@Schema()
export class Content {
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

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String] })
  actors: string[];

  @Prop({ type: [EpisodeSchema] })
  episodes?: Episode[];

  @Prop({
    contentType: { type: String, enum: CONTENT_TYPE, required: true },
  })
  contentType: CONTENT_TYPE;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
