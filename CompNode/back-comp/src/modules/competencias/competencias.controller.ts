import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competencia } from '../../entity/Competencia.entity';
import { ComptRepository } from './competencias.repository';

@Controller('nest/competencias')
export class CompetenciasController {
	constructor(
		@InjectRepository(ComptRepository)
		private readonly comptRepo: ComptRepository,
	) {}
	@Get('all')
	async getAllCompt(): Promise<Competencia[]> {
		return this.comptRepo.find();
	}
}
