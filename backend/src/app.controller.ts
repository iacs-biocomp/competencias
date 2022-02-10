import { Controller } from '@nestjs/common';
import { LoggingService } from './modules/logging/services/logging.service';

@Controller('api')
export class AppController {
	constructor(private readonly logger: LoggingService) {}
	// @Get()
	// test(): void {}
}
