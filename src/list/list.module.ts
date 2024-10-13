import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { ListController } from './list.controller';
import { UserListService } from './list.service';
import { SeedModule } from 'src/seed/seed.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SeedModule,
  ],
  controllers: [ListController],
  providers: [UserListService],
})
export class ListModule {}
