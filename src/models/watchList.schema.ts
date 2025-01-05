import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as s } from 'mongoose';
import { CONTENT_TYPE } from 'src/constants/constants';
import { Content } from './content.schema';
import { User } from './user.schema';

export type WatchListDocument = WatchList & Document;

@Schema({ timestamps: true })
export class WatchList extends Document {
  @Prop({ required: true, type: s.Types.ObjectId, ref: User.name })
  userId: s.Types.ObjectId;


  @Prop({ type: s.Types.ObjectId, required: true, ref: Content.name})
  contentId: s.Types.ObjectId;

  @Prop({
    contentType: { type: String, enum: CONTENT_TYPE, required: true },
  })
  contentType: CONTENT_TYPE;
}

const WatchListSchema = SchemaFactory.createForClass(WatchList);

WatchListSchema.index({ userId: -1, createdAt: -1 });

export { WatchListSchema };
