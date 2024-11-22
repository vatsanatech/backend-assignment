import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genre } from '../constants/constants';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
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
    required: true
  })
  genres: string[];

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], required: true })
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ title: 1 });
MovieSchema.index({ description: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ releaseDate: -1 });
MovieSchema.index({ director: 1 });
MovieSchema.index({ actors: 1 });
MovieSchema.searchIndex({
  name: 'Search index for Movie collection',
  definition: {
    mappings: {
      dynamic: true,
    }
  }
});
