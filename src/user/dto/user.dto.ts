import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";
import { PaginationQueryParamsDto } from "../../dto/request.dto";
import { contentTypes } from "../../constants/constants";
import { IsObjectId } from "../../data-validator/mongodb-objectid.validator";

export class UserListDto {
    @ApiProperty({ description: 'MongoDB Object ID of the user object in database' })
    @IsNotEmpty()
    @IsObjectId()
    userId: ObjectId;

    @ApiProperty({ description: 'MongoDB Object ID of the content (movie, tv show) object in the database' })
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty({ description: 'Content type - Movie, TVShow, etc.' })
    @IsNotEmpty()
    @IsString()
    @IsEnum(contentTypes, { message: `Allowed values for contentType: ${contentTypes.join(', ')}` })
    contentType: string;
}
