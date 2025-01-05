import { Module } from '@nestjs/common';
import { UserListService } from './list.service';
import { UserListController } from './list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchList, WatchListSchema } from 'src/models/watchList.schema';
import { User, UserSchema } from 'src/models/user.schema';
import { Content, ContentSchema } from 'src/models/content.schema'; // Import Content schema
import { ListRepository } from './list.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WatchList.name, schema: WatchListSchema },
      { name: Content.name, schema: ContentSchema }, 
    ]),
  ],
  providers: [UserListService, ListRepository],
  // exports: [UserListService], // Export UserListService to use it in other modules if needed
  controllers: [UserListController],
})
export class ListModule {}
