import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

type Reltype = 'addinferior' | 'addsuperior' | 'addpar';

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

	//TODO: Refactorizar el codigo.
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
		if (actualPeri.createdAt < todayMinus30) {
			actualPeri.actual = false;
			actualPeri.endAt = actualTime;
			await actualPeri.save();
			delete actualPeri.id;
			delete actualPeri.endAt;
			delete actualPeri.createdAt;
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			const supPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.inferiores'] })),
			);
			const superiores = await supPromise;
			actualPeri.superiores = superiores;
			await actualPeri.save();
			superiores.forEach(async sup => {
				const perActual = sup.periodos.filter(p => p.actual)[0];
				perActual.inferiores.push(trab);
				await perActual.save();
			});
		} else {
			const supPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.inferiores'] })),
			);
			const superiores = await supPromise;
			actualPeri.superiores = superiores;
			await actualPeri.save();
			await Promise.all(
				//See: https://is.gd/6l0wZi
				superiores.map(async sup => {
					const perActual = sup.periodos.filter(p => p.actual)[0];
					perActual.inferiores.push(trab);
					await perActual.save();
				}),
			);
		}
		return true;
	}
	@Post('inferiores/:dni')
	async setInferiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const todayMinus30 = new Date(new Date().setDate(-30));
		const actualTime = new Date();
		/** El trabajador sin USER */
		const trab = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.inferiores', 'periodos.catContr', 'periodos.catComp'],
			},
		);
		if (!trab) {
			return false;
		}
		/** El periodo actual del trabajador al que se le quiere añadir inferiores */
		const actualPeri = trab.periodos.filter(p => p.actual)[0];
		if (!actualPeri) {
			return false;
		}
		if (actualPeri.createdAt < todayMinus30) {
			actualPeri.actual = false;
			actualPeri.endAt = actualTime;
			await actualPeri.save();
			delete actualPeri.id;
			delete actualPeri.endAt;
			delete actualPeri.createdAt;
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			const infPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.superiores'] })),
			);
			const inferiores = await infPromise;
			actualPeri.inferiores = inferiores;
			await actualPeri.save();
			inferiores.forEach(async inf => {
				inf.periodos.filter(p => p.actual)[0].superiores.push(trab);
				await inf.periodos[0].save();
			});
		} else {
			const infPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.superiores'] })),
			);
			const inferiores = await infPromise;
			actualPeri.inferiores = inferiores;
			await actualPeri.save();
			await Promise.all(
				//See: https://is.gd/6l0wZi
				inferiores.map(async inf => {
					/** El periodo actual del inferior */
					const perInfActual = inf.periodos.filter(p => p.actual)[0];
					perInfActual.superiores.push(trab);
					await perInfActual.save();
				}),
			);
		}
		return true;
	}
	@Post('pares/:dni')
	async setPares(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const todayMinus30 = new Date(new Date().setDate(-30));
		const actualTime = new Date();
		const trab = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.pares', 'periodos.catContr', 'periodos.catComp'],
			},
		);
		if (!trab) {
			return false;
		}
		const actualPeri = trab.periodos.filter(p => p.actual)[0];
		if (!actualPeri) {
			return false;
		}
		if (actualPeri.createdAt < todayMinus30) {
			actualPeri.actual = false;
			actualPeri.endAt = actualTime;
			await actualPeri.save();
			delete actualPeri.id;
			delete actualPeri.endAt;
			delete actualPeri.createdAt;
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			const paresPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.pares'] })),
			);
			const pares = await paresPromise;
			actualPeri.pares = pares;
			await actualPeri.save();
			pares.forEach(async sup => {
				sup.periodos.filter(p => p.actual)[0].inferiores.push(trab);
				await sup.periodos[0].save();
			});
		} else {
			const paresPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', 'periodos.pares'] })),
			);
			const pares = await paresPromise;
			actualPeri.pares = pares;
			await actualPeri.save();
			// Añadir a cada par el trabajador como par de estos.
			await Promise.all(
				//See: https://is.gd/6l0wZi
				pares.map(async par => {
					const perActual = par.periodos.filter(p => p.actual)[0];
					perActual.pares.push(trab);
					perActual.save();
				}),
			);
		}
		return true;
	}
	private async methodExtraction(dni: string, relations: ITrabajador[], relType: Reltype): Promise<boolean> {
		/** Dates de utilidad en el metodo */
		const d8s = {
			/** Fecha limite, (now - dias permitidos para no crear nuevos periodos) */
			deadline: new Date(new Date().setDate(-30)),
			now: new Date(),
		};
		const trab = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.pares', 'periodos.catContr', 'periodos.catComp'],
			},
		);
		const repoRelation = () => {
			switch (relType) {
				case 'addinferior':
					return 'periodos.superior';
				case 'addpar':
					return 'periodos.par';
				case 'addsuperior':
					return 'periodos.inferior';
			}
		};
		if (!trab) {
			return false;
		}
		/** Periodo actual de `trab` */
		const actualPeri = trab.periodos.filter(p => p.actual)[0];
		if (!actualPeri) {
			return false;
		}
		// TODO: Seguir refactorizando el resto =>
		if (actualPeri.createdAt < d8s.deadline) {
			actualPeri.actual = false;
			actualPeri.endAt = d8s.now;
			await actualPeri.save();
			['id', 'endAt', 'createdAt'].forEach(p => delete actualPeri[p]);
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			/** Las relaciones (inf/par/sup) del `trab` */
			const rels = await Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', repoRelation()] })),
			);
			actualPeri.pares = rels;
			await actualPeri.save();
			rels.forEach(async rel => {
				rel.periodos.filter(p => p.actual)[0].inferiores.push(trab);
				await rel.periodos[0].save();
			});
		} else {
			const paresPromise = Promise.all(
				relations.map(r => this.trabRepo.findOne({ dni: r.dni }, { relations: ['periodos', repoRelation()] })),
			);
			const pares = await paresPromise;
			actualPeri.pares = pares;
			await actualPeri.save();
			// Añadir a cada par el trabajador como par de estos.
			await Promise.all(
				//See: https://is.gd/6l0wZi
				pares.map(async par => {
					const perActual = par.periodos.filter(p => p.actual)[0];
					perActual.pares.push(trab);
					perActual.save();
				}),
			);
		}
		return true;
	}
	/** Función de ayuda para remover multiples keys de un objeto en una linea */
	private deleteProps(obj, prop) {
		for (const p of prop) {
			p in obj && delete obj[p];
		}
	}
}
