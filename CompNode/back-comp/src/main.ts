import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Configuration as cnf } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { install } from 'source-map-support';
import { Promise } from 'bluebird';
import { findCompById } from 'sharedCode/Utility';

const cnfService = new ConfigService();

async function bootstrap() {
	install();
	if (process.env.NODE_ENV !== 'production') {
		//Las promesas de node no muestran un stacktrace descriptivo, se usan estas,
		// en producción las nativas ya que tienen mejor rendimiento
		global.Promise = require('bluebird');
		Promise.config({
			longStackTraces: true,
		});
	}
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
