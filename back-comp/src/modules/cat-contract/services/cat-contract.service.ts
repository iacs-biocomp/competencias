import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr } from 'sharedInterfaces/Entity';
import { CatContr } from 'src/entity';
import { CatContrRepo } from '../catContr.repository';

@Injectable()
export class CatContractService {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly cContrRepo: CatContrRepo,
	) {}

	/**
	 * Gets all the cContr saved in the db, same as:
	 * ```ts
	 * this.catContrRepo.find({ relations: ['catComp'] });
	 * ```
	 * @returns Promise with all the cContrs in db
	 */
	getAll(): Promise<ICContrAndCCompDTO[]> {
		return this.cContrRepo.find({ relations: ['catComp'] }) as Promise<ICContrAndCCompDTO[]>;
	}

	/**
	 * Gets one CatContr from the db, same as:
	 * ```ts
	 * this.catContrRepo.findOne(id);
	 * ```
	 * @param id The id of the contractual category which will be searched
	 * @returns Promise of the CatContr saved
	 */
	getOne(id: ICatContr['id']): Promise<CatContr | undefined> {
		return this.cContrRepo.findOne(id);
	}

	/**
	 * Deletes one ICatContr from the db, same as:
	 * ```ts
	 * this.catContrRepo.remove(cContr);
	 * ```
	 * The catContr should exist in db.
	 *
	 * @param cContr The contractual category to delete in database
	 * @returns Promise of the CatContr deleted
	 */
	delete(cContr: CatContr): Promise<CatContr> {
		return this.cContrRepo.remove(cContr);
	}
	/**
	 * Deletes many CatContr into the db, same as:
	 * ```ts
	 * this.catContrRepo.save(cContr);
	 * ```
	 * The catContr should exist in db.
	 * @param cContr The contractual category to save in database
	 * @returns Promise of the CatContr saved
	 */
	deleteMany(cContr: CatContr[]): Promise<CatContr[]> {
		return this.cContrRepo.remove(cContr);
	}

	/**
	 * Saves one ICatContr into the db, same as:
	 * ```ts
	 * this.catContrRepo.save(cContr);
	 * ```
	 * @param cContr The contractual category to save in database
	 * @returns Promise of the CatContr saved
	 */
	save(cContr: ICatContr): Promise<CatContr> {
		return this.cContrRepo.save(cContr);
	}
}
