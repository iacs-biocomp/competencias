import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionesController } from './evaluaciones.controller';
import { EvRepository } from './evaluaciones.repository';

@Module({
	imports: [TypeOrmModule.forFeature([EvRepository])],
	controllers: [EvaluacionesController],
})
export class EvaluacionesModule {}
