import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComptRepository } from './competencias.repository';
import { CompetenciasController } from './controllers/competencias.controller';
import { CompetenciasService } from './services/competencias.service';

@Module({
	imports: [TypeOrmModule.forFeature([ComptRepository])],
	controllers: [CompetenciasController],
	providers: [CompetenciasService],
})
export class CompetenciasModule {}
