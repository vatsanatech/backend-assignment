import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
export type UserDocument = User & Document;
import { genre, contentTypes } from '../constants/constants';
import { IsEnum } from "class-validator";

@Schema()
export class User {
  @Prop({ required: true, unique: true  })
  username: string;

  @Prop({ required: true, unique: true })
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
    default: []
  })
  favoriteGenres: string[];

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
    default: []
  })
  dislikedGenres: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
UserSchema.index({ email: 1, password: 1 });


@Schema()
export class UserList {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: ObjectId;

  @Prop({ required: true, unique: true })
  contentId: string;

  @Prop({ required: true, enum: contentTypes })
  contentType: string;
}

export const UserListSchema = SchemaFactory.createForClass(UserList);
UserListSchema.index({ userId: 1 });


@Schema()
export class WatchHistory {
  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  watchedOn: Date
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
WatchHistorySchema.index({ watchedOn: 1 });
