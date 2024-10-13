import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.schema';
import { AddToListDto } from './dto/list-user.dto';

@Injectable()
export class UserListService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async addToList(itemDetails: AddToListDto): Promise<User | null> {
    const { contentId, contentType, userId } = itemDetails;

    const updatedList = await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $push: { myListing: { contentId, contentType } },
        },
        { new: true },
      )
      .select('myListing');
    return updatedList;
  }

  async removeFromList(
    userId: string,
    contentId: string,
  ): Promise<User | null> {
    const updatedList = await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $pull: { myListing: { contentId } },
        },
        { new: true },
      )
      .select('myListing');
    return updatedList;
  }

  // finds if the content item exist for the user
  async findUserItem(userId: string, itemId: string): Promise<User | null> {
    return await this.userModel
      .findOne({
        _id: userId,
        'myListing.contentId': itemId,
      })
      .select('myListing');
  }

  // list items of the user
  async listMyItems(userId: string) {
    const userContent = await this.userModel
      .findById(userId)
      .select('myListing');
    return userContent;
  }
}
