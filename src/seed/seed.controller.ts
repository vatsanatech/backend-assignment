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
import { ConfigService } from "@nestjs/config";

@ApiTags('Seeding database')
@Controller('seed')
export class SeedController {
    constructor(
        private readonly seedService: SeedService,
        private readonly configuration: ConfigService
    ) { }

    @Get('init')
    @ApiNoContentResponse()
    async init() {
        const env = this.configuration.get('env');

        if (env === 'LOCAL') {
            return this.seedService.seedDatabase();
        }
    }
}
