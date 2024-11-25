import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";
import { PaginationQueryParamsDto } from "../../dto/request.dto";
import { contentTypes } from "../../constants/constants";

export class UserListDto {
    @ApiProperty({ description: 'MongoDB Object ID of the user object in database' })
    @IsNotEmpty()
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
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

export class UserListQueryParamsDto extends PaginationQueryParamsDto {
    @ApiProperty({ description: 'MongoDB Object ID of the user object in database' })
    @IsNotEmpty()
    @IsString()
    userId: string;
}
