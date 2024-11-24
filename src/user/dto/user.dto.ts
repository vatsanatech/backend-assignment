import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";
import { PaginationQueryParamsDto } from "../../dto/request.dto";
import { contentTypes } from "../../constants/constants";

export class UserListDto {
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    userId: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(contentTypes, { message: `Allowed values for contentType: ${contentTypes.join(', ')}` })
    contentType: string;
}

export class UserListQueryParamsDto extends PaginationQueryParamsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}
