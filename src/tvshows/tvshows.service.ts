// src/tvshows/tvshows.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from '../models/content.schema';
import { CreateTVshowDto } from './dto/create-tvshow.dto';

@Injectable()
export class TVShowsService {
  constructor(
    @InjectModel(Content.name)
    private readonly tvShowModel: Model<ContentDocument>,
  ) {}

  async findAll(): Promise<Content[]> {
    return this.tvShowModel.find().exec();
  }

  async create(createTVShowDto: CreateTVshowDto): Promise<Content> {
    const createdTVShow = new this.tvShowModel(createTVShowDto);
    return createdTVShow.save();
  }
}
