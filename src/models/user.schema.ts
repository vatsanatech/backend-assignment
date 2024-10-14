import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;
import { genre } from '../constants/constants';

export const CONTENT_TYPE_ENUM = ['Movie', 'TVShow'] as const;
export type ContentType = (typeof CONTENT_TYPE_ENUM)[number];

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  favoriteGenres: string[];

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  dislikedGenres: string[];

  @Prop([
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @Prop([
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: CONTENT_TYPE_ENUM, required: true },
    },
  ])
  myList: {
    contentId: string;
    contentType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
