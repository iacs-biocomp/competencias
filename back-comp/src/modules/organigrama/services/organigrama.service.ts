import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { areIntervalsOverlapping } from 'date-fns';
import { deleteProps } from 'sharedCode/Utility';
import { ICCompDTO } from 'sharedInterfaces/DTO';
import { PeriodoTrab, PeriodWithInferiores, PeriodWithPares, PeriodWithSuperiores, Trabajador } from 'src/entity';
import { PeriodosRepo } from 'src/modules/trabajadores/periodos.repository';
import { TrabajadorRepo } from 'src/modules/trabajadores/trabajador.repository';
import { SelectQueryBuilder } from 'typeorm';

type PeriodWithRelations = PeriodWithSuperiores & PeriodWithInferiores & PeriodWithPares;
type PeriodWithIntervalNoDate = Omit<PeriodWithRelations, 'createdAt' | 'endAt'> & {
	interval: Interval;
};

@Injectable()
export class OrganigramaService {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
		@InjectRepository(PeriodosRepo)
		private readonly periodRepo: PeriodosRepo,
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

	/**
	 *
	 * @param dni
	 * @param range
	 * @throws error
	 */
	async getUsrOrganisByRange(dni: string, range: Interval): Promise<PeriodWithIntervalNoDate[]> {
		const wrk = this.trabRepo.findOne(dni);
		// TypeORM Query Operators

		if (!wrk) {
			throw new Error('Bad dni');
		}
		// const BeforeDate = (date: Date) => Between(subYears(date, 100), date);
		// TODO: Method extraction, move this code to PeriodService and inject service here
		const allPeriods = await this.periodRepo.find({
			where: { trabajador: dni },
			relations: ['superiores', 'pares', 'inferiores'],
		});
		const mapedPeriods = allPeriods.map<PeriodWithIntervalNoDate>(p => {
			const Pt = PeriodoTrab;
			const conditions = Pt.isPeriodWithInferiores(p) && Pt.isPeriodWithPares(p) && Pt.isPeriodWithSuperiores(p);
			if (conditions) {
				const interval: Interval = { start: p.createdAt, end: p.endAt ?? new Date() };
				const periodOe = deleteProps(p, ['createdAt', 'endAt']);
				// const period = { ...p, interval: { start: p.createdAt, end: p.endAt ?? new Date() } };
				return { ...periodOe, interval } as PeriodWithIntervalNoDate;
			} else {
				throw new Error('Relations not loaded properly');
			}
		});
		// TODO: Comprobar, posiblemente true en options
		return mapedPeriods.filter(period => areIntervalsOverlapping(period.interval, range));

		// allPeriods.map();
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
