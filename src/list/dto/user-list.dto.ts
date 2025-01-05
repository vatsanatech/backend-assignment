import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CONTENT_TYPE } from 'src/constants/constants';

export class CreateUserListItemDto {
  @ApiProperty()
  @IsString()
  contentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE)
  contentType: CONTENT_TYPE;

  @ApiProperty()
  @IsString()
  userId: string;
}

export class RemoveUserListItemDto {
  @ApiProperty()
  @IsString()
  contentId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
