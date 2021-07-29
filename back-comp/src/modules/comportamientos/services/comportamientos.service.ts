import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comportamiento } from 'src/entity';
import { ComportRepository } from '../comportamientos.repository';

@Injectable()
export class ComportamientosService {
	constructor(@InjectRepository(ComportRepository) private readonly comportRepo: ComportRepository) {}

	// TODO: Tsdoc & exact type
	findAll(): Promise<Comportamiento[]> {
		return this.comportRepo.find({ relations: ['subModels'] });
	}

	findOne(id: string): Promise<Comportamiento | undefined> {
		// const idStr = typeof id === 'string' ? id : id.id;
		return this.comportRepo.findOne({ id: id }, { relations: ['subModels'] });
	}
}
