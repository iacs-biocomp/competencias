import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvRepository } from './evaluaciones.repository';
import { EvaluacionesController } from './controllers/evaluaciones.controller';
import { EvaluacionesService } from './services/evaluaciones.service';
import { OrganigramaService } from '../organigrama/services/organigrama.service';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { PeriodosRepo } from '../trabajadores/periodos.repository';

@Module({
	imports: [TypeOrmModule.forFeature([TrabajadorRepo, EvRepository, PeriodosRepo])],
	controllers: [EvaluacionesController],
	providers: [EvaluacionesService, OrganigramaService],
})
export class EvaluacionesModule {}
