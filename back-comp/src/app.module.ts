import { CompressionMiddleware } from '@aml360/nestjs-compression';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { FrontendMiddleware } from './middlewares/frontend.middleware';
import {
	CatCompModule,
	CatContractModule,
	CompetenciasModule,
	ComportamientosModule,
	EvaluacionesModule,
	ModelosModule,
	NivelesModule,
	OrganigramaModule,
	TrabajadoresModule,
	UserModule,
	ValoracionesModule,
	LoggingModule,
} from './modules';
import { LoggingService } from './modules/logging/services/logging.service';

@Module({
	imports: [
		UserModule,
		DatabaseModule,
		ServeStaticModule.forRoot({
			rootPath: join('/app', '/ngDist'),
			exclude: ['/nest*'],
		}),
		EvaluacionesModule,
		CompetenciasModule,
		NivelesModule,
		ComportamientosModule,
		CatContractModule,
		CatCompModule,
		TrabajadoresModule,
		OrganigramaModule,
		ModelosModule,
		ValoracionesModule,
		LoggingModule,
	],
	controllers: [AppController],
	providers: [AuthGuard, ConfigService, ...LoggingService.configure({ context: 'dsad' })],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//Modulo que comprime las request con gzip
		CompressionMiddleware.configure({ level: 8 });
		consumer.apply(FrontendMiddleware, CompressionMiddleware).forRoutes({ path: '**', method: RequestMethod.ALL });
	}
}
