import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
import { genre } from '../constants/constants';

// Content Type for listings
export const CONTENT_TYPE_ENUM = ['Movie', 'TVShow'] as const;
export type ContentType = (typeof CONTENT_TYPE_ENUM)[number];

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

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
      contentId: { type: Types.ObjectId, required: true },
      contentType: { type: String, enum: CONTENT_TYPE_ENUM, required: true },
    },
  ])
  myListing: {
    id: string;
    type: ContentType;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
