import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserList } from "../models/user.schema";
import mongoose, { Model, ObjectId } from "mongoose";
import { UserListDto } from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserList.name) private userListModel: Model<UserList>
    ) { }

    async addToList(userListDto: UserListDto) {
        const userExists = await this.userModel.findById(userListDto.userId).select({ _id: 1 }).exec();

        if (!userExists) {
            return null;
        }

        const userList = new this.userListModel(userListDto);
        return userList.save();
    }

    async removeFromList(_id: string) {
        return this.userListModel.deleteOne({ _id: new mongoose.Types.ObjectId(_id) }).exec();
    }

    async listMyItems(userId: string, limit: number, skip: number) {
        const [list, total] = await Promise.all([
            this.userListModel.find({ userId: new mongoose.Types.ObjectId(userId) }).limit(limit).skip(skip).exec(),
            this.userListModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) })
        ]);

        return {
            total,
            list
        }
    }

    async listUser(id: string) {
        return this.userModel.findById(id).select('-password').exec();
    }
}
