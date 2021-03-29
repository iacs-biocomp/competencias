import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvRepository } from './evaluaciones.repository';

@Controller('nest/evaluaciones')
export class EvaluacionesController {
	constructor(
		@InjectRepository(EvRepository) private readonly evRepo: EvRepository,
	) {}

	@Get()
	getEvsOfUser() {
		return this.evRepo.find();
	}
}
