import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;
import { genre } from '../constants/constants';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
