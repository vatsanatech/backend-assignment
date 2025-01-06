import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as s } from 'mongoose';
import { Content } from './content.schema';
import { User } from './user.schema';

export type MyListDocument = MyList & Document;

@Schema({ timestamps: true })
export class MyList extends Document {
  @Prop({ required: true, type: s.Types.ObjectId, ref: User.name })
  userId: s.Types.ObjectId;

  @Prop({ type: s.Types.ObjectId, required: true, ref: Content.name })
  content: s.Types.ObjectId;
}

const MyListSchema = SchemaFactory.createForClass(MyList);

MyListSchema.index({ userId: -1, createdAt: -1 });
MyListSchema.index({ userId: -1, content: -1 }, { unique: true });

export { MyListSchema };
