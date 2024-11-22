import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from "class-validator";

export class PaginationQueryParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number = 10;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  skip: number = 0;
}
