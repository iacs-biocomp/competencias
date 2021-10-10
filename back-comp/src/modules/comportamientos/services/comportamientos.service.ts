import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comportamiento, ComportWithSubModels } from 'src/entity';
import { ComportRepository } from '../comportamientos.repository';

@Injectable()
export class ComportamientosService {
	constructor(@InjectRepository(ComportRepository) private readonly comportRepo: ComportRepository) {}

	// TODO: Tsdoc & exact type
	findAll(): Promise<Comportamiento[]> {
		return this.comportRepo.find({ relations: ['subModels'] });
	}

	async findOne(id: string): Promise<ComportWithSubModels | undefined> {
		const comportDb = await this.comportRepo.findOne({ id: id }, { relations: ['subModels'] });
		if (!comportDb) {
			return undefined;
		}
		if (!Comportamiento.isComportWithSubModels(comportDb)) {
			throw new Error('This should never happen, relations not loaded correctly');
		}
		return comportDb;
	}

	async delete(id: string) {
		await this.comportRepo.delete(id);
	}
}
