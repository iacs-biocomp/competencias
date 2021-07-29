import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICCompDTO } from 'sharedInterfaces/DTO';
import { Trabajador } from 'src/entity';
import { TrabajadorRepo } from 'src/modules/trabajadores/trabajador.repository';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class OrganigramaService {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
	) {}

	/**
	 * TODO: Completar
	 * @returns Completar
	 */
	getWorkersWithPeriodsAndRelations(): Promise<NewDtoTrabajador[]> {
		return this.trabRepo.find({
			join: {
				alias: 'trabajador',
				leftJoinAndSelect: {
					periodos: 'trabajador.periodos',
					catComp: 'periodos.catComp',
					superiores: 'periodos.superiores',
					inferiores: 'periodos.inferiores',
					pares: 'periodos.pares',
				},
			},
			where: (qb: SelectQueryBuilder<Trabajador>) => {
				qb.where('periodos.actual = true');
			},
		}) as unknown as Promise<NewDtoTrabajador[]>;
	}
}

// TODO: Cambiar, usar extends en entity y validadores
interface NewDtoTrabajador {
	dni: string;
	nombre: string;
	apellidos: string;
	area: string;
	unidad: string;
	departamento: string | null;
	periodos: PeriodoO[];
}

export interface PeriodoO {
	id: number;
	createdAt: Date;
	endAt: null;
	actual: boolean;
	catComp: ICCompDTO;
	superiores: Omit<NewDtoTrabajador, 'periodos'>[];
	inferiores: Omit<NewDtoTrabajador, 'periodos'>[];
	pares: Omit<NewDtoTrabajador, 'periodos'>[];
}
