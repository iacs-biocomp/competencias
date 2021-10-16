import { Injectable } from '@nestjs/common';
import { ComptRepository } from '../competencias.repository';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { Competencia } from 'src/entity';
import { ICompGetDTO } from 'sharedInterfaces/DTO';

@Injectable()
export class CompetenciasService {
	constructor(private readonly compRepo: ComptRepository) {}
	// TODO: Tsdoc
	getAll(): Promise<ICompGetDTO[]> {
		return this.compRepo.find() as Promise<ICompGetDTO[]>;
	}

	// TODO: Tsdoc
	getOneById(id: ICompetencia['id']): Promise<ICompGetDTO> {
		return this.compRepo.findOne(id) as Promise<ICompGetDTO>;
	}

	deleteOne(comp: Competencia): Promise<Competencia> {
		return this.compRepo.remove(comp);
	}
}
