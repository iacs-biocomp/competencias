import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { FrontendMiddleware } from './middlewares/frontend.middleware';
import { UserModule } from './modules/users/user.module';
import { EvaluacionesModule } from './modules/evaluaciones/evaluaciones.module';
import { CompetenciasModule } from './modules/competencias/competencias.module';
import { NivelesModule } from './modules/niveles/niveles.module';
import { ComportamientosModule } from './modules/comportamientos/comportamientos.module';
import { CatContractModule } from './modules/cat-contract/cat-contract.module';
import { CatCompModule } from './modules/cat-comp/cat-comp.module';
import { TrabajadoresModule } from './modules/trabajadores/trabajadores.module';
import { OrganigramaModule } from './modules/organigrama/organigrama.module';
import { ModelosModule } from './modules/modelos/modelos.module';
import { CompressionMiddleware } from '@aml360/nestjs-compression';

@Module({
	imports: [
		UserModule,
		DatabaseModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'ngDist'),
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
	],
	controllers: [AppController],
	providers: [AppService, AuthGuard, ConfigService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//Modulo que comprime las request con gzip
		CompressionMiddleware.configure({ level: 8 });
		consumer.apply(FrontendMiddleware, CompressionMiddleware).forRoutes({ path: '**', method: RequestMethod.ALL });
	}
}
