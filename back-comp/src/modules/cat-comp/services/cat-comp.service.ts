import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICCompCContrDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { CatComp } from 'src/entity';
import { CatCompRepo } from '../catComp.repository';

@Injectable()
export class CatCompService {
	constructor(
		@InjectRepository(CatCompRepo)
		private readonly catCompRepo: CatCompRepo,
	) {}

	/**
	 * Busca todas las catCompetenciales y añade la relacion/es que se indiquen,
	 * sin cargar de manera recursiva las relaciones a nivel 2
	 * @param relations Array con las
	 * @returns Promesa con las catcomps
	 */
	// getAllWithRelations(): Promise<T> {}

	/**
	 * Busca todas las catCompetenciales y sus catContr
	 * @returns Promesa con las catcomps y las categorías contractuales asociadas a estas
	 */
	getAll(): Promise<ICCompCContrDTO[]> {
		return this.catCompRepo.find({ relations: ['catContr'] }) as Promise<ICCompCContrDTO[]>;
	}

	/**
	 *
	 * @param id The id used by the search
	 * @returns Promise with one CComp or undefined
	 */
	getOne(id: ICatComp['id']): Promise<ICCompCContrDTO | undefined> {
		return this.catCompRepo.findOne({ id: id }, { relations: ['catContr'] }) as Promise<ICCompCContrDTO>;
	}

	/**
	 *
	 * @param cComp
	 * @returns
	 */
	save(cComp: ICCompDTO): Promise<CatComp> {
		// TODO: Tal vez cambiar por un .insert(),
		return this.catCompRepo.save(cComp);
	}
}
