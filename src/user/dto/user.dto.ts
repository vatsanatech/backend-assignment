import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";
import { PaginationQueryParamsDto } from "../../dto/request.dto";

export class UserListDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({value}) => new mongoose.Types.ObjectId(value))
    userId: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contentType: string;
}

export class UserListQueryParamsDto extends PaginationQueryParamsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}
