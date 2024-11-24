import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class PaginationQueryParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({value}) => parseInt(value) || 10)
  limit: number = 10;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  @Transform(({value}) => parseInt(value) || 0)
  skip: number = 0;
}
