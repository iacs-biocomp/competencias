import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Configuration as cnf } from './config/config.keys';
import { ConfigService } from './config/config.service';
// import 'source-map-support/register';
import { install } from 'source-map-support';

const cnfService = new ConfigService();

async function bootstrap() {
	install();
	// require('source-map-support').install();
	//TODO: revisar lo del cors, posibles ataques csrf si está en true (Para producción en false?)
	const app = await NestFactory.create(AppModule, { cors: true });

	const options = new DocumentBuilder()
		.setTitle('Nest Competencias')
		.setDescription('Backend nest competencias')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(cnfService.get(cnf.APP_PORT));
}
bootstrap();
