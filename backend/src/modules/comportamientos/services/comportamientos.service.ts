import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comportamiento, ComportWithSubModels } from 'src/entity';
import { DeleteResult } from 'typeorm';
import { ComportRepository } from '../comportamientos.repository';

@Injectable()
export class ComportamientosService {
	constructor(@InjectRepository(ComportRepository) private readonly comportRepo: ComportRepository) {}

	// TODO: Tsdoc
	// TODO: Add exact type, Comportamiento is entity type
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

	/**
	 * Deletes one comport from the db.
	 * Executes fast and efficient DELETE query. Does not check if entity exist in the database.
	 * The comport should exist in db.
	 *
	 * Same as:
	 * ```ts
	 * this.comportRepo.delete(id);
	 * ```
	 * @param id The id of the comport to delete from database
	 * @returns Promise with {@link DeleteResult}, exception should be controlled
	 */
	delete(id: string): Promise<DeleteResult> {
		return this.comportRepo.delete(id);
	}
}
