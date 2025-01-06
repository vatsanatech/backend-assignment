import { Module } from '@nestjs/common';
import { UserListService } from './list.service';
import { UserListController } from './list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MyList, MyListSchema } from '../models/myList.schema';
import { User, UserSchema } from '../models/user.schema';
import { Content, ContentSchema } from '../models/content.schema';
import { ListRepository } from './list.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MyList.name, schema: MyListSchema },
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  providers: [UserListService, ListRepository],
  // exports: [UserListService], // Export UserListService to use it in other modules if needed
  controllers: [UserListController],
})
export class ListModule {}
