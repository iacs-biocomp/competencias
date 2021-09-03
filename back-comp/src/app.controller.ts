import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './modules/logging/services/logging.service';

@Controller('api')
export class AppController {
	constructor(private readonly logger: LoggingService) {}
	// private readonly logger = new Logger(AppController.name);

	@Get()
	test(): string {
		this.logger.verbose('verbose msg');
		this.logger.debug('debug msg');
		this.logger.error('error stuff');
		this.logger.warn('warning stuff');
		this.logger.log('logging level');
		return 'Hello!';
	}
}
