import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Configuration as cnf } from './config/config.keys';
import { ConfigService } from './config/config.service';

const cnfService = new ConfigService();

async function bootstrap() {
	//TODO: revisar lo del cors, posibles ataques csrf si está en true (Para producción en false?)
	const app = await NestFactory.create(AppModule, { cors: true });

	const options = new DocumentBuilder()
		.setTitle('Nest Inves')
		.setDescription('Nest Investigación JS')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(cnfService.get(cnf.APP_PORT));
}
bootstrap();
