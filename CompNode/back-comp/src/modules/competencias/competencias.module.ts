import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciasController } from './competencias.controller';
import { ComptRepository } from './competencias.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ComptRepository])],
	controllers: [CompetenciasController],
})
export class CompetenciasModule {}
