import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CONTENT_TYPE_ENUM, ContentType } from 'src/models/user.schema';
import { IsObjectId } from 'src/utils/validator';

export class ListUserItemDto {
  @IsObjectId()
  userId: string;
}

export class AddToListDto {
  @ApiProperty()
  @IsObjectId()
  userId: string;

  @ApiProperty()
  @IsObjectId()
  contentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM, {
    message: 'Valid Content Type: Movie or TV Show',
  })
  contentType: ContentType;
}

export class RemoveFromListDto {
  @ApiProperty()
  @IsObjectId()
  userId: string;

  @ApiProperty()
  @IsObjectId()
  contentId: string;
}
