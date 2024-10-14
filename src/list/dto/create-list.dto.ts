import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    description: "The ID of the content to add to the user's list",
    example: '670b78bb6551993e4e3a9667',
  })
  @IsString()
  contentId: string;

  @ApiProperty({
    description: 'The type of content (e.g., movie, tvshow)',
    example: 'Movie',
  })
  @IsString()
  contentType: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '670b78bb6551993e4e3a962f',
  })
  @IsString()
  userId: string;
}