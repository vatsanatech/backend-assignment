import { IsNotEmpty, IsString, IsArray, IsEnum, IsDate, IsInt, Min, Max, IsEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { genre } from '../../constants/constants';

export class WatchHistoryItem {
    @ApiProperty({ description: 'The ID of the watched content'})
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty({ description: 'The date the content was watched', example: '2024-10-10T00:00:00.000Z' })
    @IsNotEmpty()
    @IsDate()
    watchedOn: Date;

    @ApiProperty({ description: 'Rating of the content', example: 4 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}

export class MyListItem {
    @ApiProperty({ description: 'The ID of the content in the list', example: 'xyz789' })
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty({ description: 'The type of content', enum: ['Movie', 'TVShow'] })
    @IsNotEmpty()
    @IsString()
    @IsEnum(['Movie', 'TVShow'])
    contentType: string;
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: 'User’s favorite genres', isArray: true, enum: genre })
    @IsArray()
    @IsEnum(genre, { each: true })
    @IsOptional() 
    favoriteGenres: string[];

    @ApiProperty({ description: 'User’s disliked genres', isArray: true, enum: genre })
    @IsArray()
    @IsEnum(genre, { each: true })
    @IsOptional() 
    dislikedGenres: string[];

    @ApiProperty({ type: [WatchHistoryItem], description: 'History of watched content' })
    @IsArray()
    @IsOptional() 
    watchHistory: WatchHistoryItem[];

    @ApiProperty({ type: [MyListItem], description: 'Content saved by the user' })
    @IsArray()
    @IsOptional()
    myList: MyListItem[];
}
