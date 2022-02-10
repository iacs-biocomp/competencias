import { Module } from '@nestjs/common';
import { LoggingController } from './controllers/logging.controller';

@Module({
	controllers: [LoggingController],
	providers: [],
})
export class LoggingModule {}
