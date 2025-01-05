import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from '../models/content.schema';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Content.name) private readonly movieModel: Model<ContentDocument>,
  ) {}

  async findAll(): Promise<Content[]> {
    return this.movieModel.find().exec();
  }

  async create(createMovieDto: CreateMovieDto): Promise<Content> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }
}
