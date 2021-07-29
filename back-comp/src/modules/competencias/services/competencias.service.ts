import { Injectable } from '@nestjs/common';
import { ComptRepository } from '../competencias.repository';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { Competencia } from 'src/entity';
import { ICompGetDTO, ICompNoRelationsDTO } from 'sharedInterfaces/DTO';

@Injectable()
export class CompetenciasService {
	constructor(private readonly compRepo: ComptRepository) {}
	// TODO: Tsdoc
	getAll(): Promise<ICompGetDTO[]> {
		return this.compRepo.find() as Promise<ICompNoRelationsDTO[]>;
	}

	// TODO: Tsdoc
	getOneById(id: ICompetencia['id']): Promise<ICompNoRelationsDTO> {
		return this.compRepo.findOne(id) as Promise<ICompNoRelationsDTO>;
	}

	deleteOne(comp: Competencia): Promise<Competencia> {
		return this.compRepo.remove(comp);
	}
}
