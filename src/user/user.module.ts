import { Module } from '@nestjs/common';
import { User, UserList, UserListSchema, UserSchema, WatchHistory, WatchHistorySchema } from "../models/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserList.name, schema: UserListSchema }]),
    MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
