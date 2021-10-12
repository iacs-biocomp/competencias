import { Body, Controller, Post } from '@nestjs/common';
import { IFrontLoggingPayload } from 'sharedInterfaces/DTO';

@Controller('logging')
export class LoggingController {
	// constructor(private readonly loggerSv: LoggingService) {}
	@Post('')
	changeName(@Body() jsonLogginFront: IFrontLoggingPayload) {
		// TODO: Complete method, should log in separate file all messages from certain client
	}
}
