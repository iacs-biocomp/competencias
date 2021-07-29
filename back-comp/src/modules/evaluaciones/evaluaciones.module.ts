import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvRepository } from './evaluaciones.repository';
import { EvaluacionesController } from './controllers/evaluaciones.controller';
import { EvaluacionesService } from './services/evaluaciones.service';

@Module({
	imports: [TypeOrmModule.forFeature([EvRepository])],
	controllers: [EvaluacionesController],
	providers: [EvaluacionesService],
})
export class EvaluacionesModule {}
