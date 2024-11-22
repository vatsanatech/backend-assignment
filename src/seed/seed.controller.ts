import {
    Controller,
    Get,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from "./seed.service";

@ApiTags('Seeding database')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Get('init')
    @ApiNoContentResponse()
    async init(): Promise<void> {
        this.seedService.seedDatabase();
    }
}
