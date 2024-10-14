import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CONTENT_TYPE_ENUM } from 'src/models/user.schema';

export class CreateListDto {
  @ApiProperty({
    description: "The ID of the content to add to the user's list",
    example: '670b78bb6551993e4e3a9667',
  })
  @IsString()
  contentId: string;

  @ApiProperty({
    description: 'The type of content (e.g., Movie, TVShow)',
    example: 'Movie',
  })
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM, {
    message: 'Content Type should be either Movie or TV Show',
  })
  contentType: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '670b78bb6551993e4e3a962f',
  })
  @IsString()
  userId: string;
}
