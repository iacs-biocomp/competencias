import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration as cnfKeys } from 'src/config/config.keys';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { EvRepository } from '../evaluaciones/evaluaciones.repository';
import { OrganigramaService } from '../organigrama/services/organigrama.service';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { ValoracionesController } from './controllers/valoraciones.controller';
import { ValoracionesService } from './services/valoraciones.service';
import { ValoracionesRepo } from './valoraciones.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([ValoracionesRepo, EvRepository, TrabajadorRepo, PeriodosRepo]),
		// TODO: refactor, encontrar manera de no registar el modulo con la configuración aqui también (esta en authModule)
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory(cnfSv: ConfigService) {
				return {
					secret: cnfSv.get(cnfKeys.JWT_SECRET),
					signOptions: {
						expiresIn: parseInt(cnfSv.get(cnfKeys.JWT_EXPIRETIME)),
					},
				};
			},
		}),
	],
	controllers: [ValoracionesController],
	providers: [ValoracionesService, ConfigService, OrganigramaService],
})
export class ValoracionesModule {}
