import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { PeriodoTrab } from 'src/entity/PeriodoTrab.entity';
import { Trabajador } from 'src/entity/Trabajador.entity';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';

interface Organigrama {
	inferiores: Trabajador[];
	superiores: Trabajador[];
	pares: Trabajador[];
}
interface UsrWithOrgani extends Organigrama {
	trabajador: Trabajador;
}
interface ITrabajador {
	dni: string;

	nombre: string;

	apellidos: string;

	area: string;

	unidad: string;

	departamento: string;
}

@Controller('nest/organigrama')
export class OrganigramaController {
	constructor(
		@InjectRepository(TrabajadorRepo)
		private readonly trabRepo: TrabajadorRepo,
		@InjectRepository(UserRepository)
		private readonly usrRepo: UserRepository,
	) {}

	@Get('all')
	async getAll(): Promise<UsrWithOrgani[]> {
		const workers = await this.trabRepo.find({
			relations: ['periodos', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
		const organiFull: UsrWithOrgani[] = workers.map(wrk => {
			//Filtro el periodo al actual
			wrk.periodos = wrk.periodos.filter(per => per.actual);
			const org: UsrWithOrgani = {
				inferiores: wrk.periodos[0].inferiores,
				superiores: wrk.periodos[0].superiores,
				pares: wrk.periodos[0].pares,
				trabajador: wrk,
			};
			//Borro los periodos de cada trabajador (Info no necesaria)
			delete org.trabajador.periodos;
			return org;
		});
		return organiFull;
	}

	//TODO: Completar para añadir los parametros como queryparams y no como el dni tal que :dni
	@Get(':username')
	async getOrganigramaUsr(@Param('username') username: string): Promise<Organigrama> {
		const usr = await this.usrRepo.findOne(
			{ username: username },
			{
				relations: [
					'trabajador',
					'trabajador.periodos',
					'trabajador.periodos.superiores',
					'trabajador.periodos.inferiores',
					'trabajador.periodos.pares',
				],
			},
		);
		const worker = usr.trabajador;
		const actualPer: PeriodoTrab = worker.periodos.filter(per => per.actual)[0];
		const organi: Organigrama = {
			inferiores: actualPer.inferiores,
			superiores: actualPer.superiores,
			pares: actualPer.pares,
		};
		return organi;
	}
	@Post('superiores/:dni')
	async setSuperiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const todayMinus30 = new Date(new Date().setDate(-30));
		const actualTime = new Date();
		const trab = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.superiores', 'periodos.catContr', 'periodos.catComp'],
			},
		);
		if (!trab) {
			return false;
		}
		const actualPeri = trab.periodos.filter(p => p.actual)[0];
		if (!actualPeri) {
			return false;
		}
		if (actualPeri.createdAt > todayMinus30) {
			actualPeri.actual = false;
			actualPeri.endAt = actualTime;
			await actualPeri.save();
			delete actualPeri.id;
			delete actualPeri.endAt;
			delete actualPeri.createdAt;
			console.log(actualPeri);
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			const oe = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.inferiores'] })),
			);
			const superiores = await oe;
			superiores.forEach(sup => {
				console.log(sup);
			});
			//TODO: Refactor y no crear un nuevo periodo si el periodo ha sido creado hace X dias o menos (Env variable para X)
			actualPeri.superiores = superiores;
			await actualPeri.save();
			superiores.forEach(async sup => {
				sup.periodos.filter(p => p.actual)[0].inferiores.push(trab);
				await sup.periodos[0].save();
			});
		}
		return true;
	}
}
