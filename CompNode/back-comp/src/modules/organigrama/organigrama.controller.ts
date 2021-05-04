import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CatComp } from 'src/entity/CatComp.entity';
import { PeriodoTrab } from 'src/entity/PeriodoTrab.entity';
import { Trabajador } from 'src/entity/Trabajador.entity';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { time } from 'console';
interface Organigrama {
	inferiores: Trabajador[];
	superiores: Trabajador[];
	pares: Trabajador[];
}
interface UsrWithOrgani extends Organigrama {
	trabajador: Trabajador & { catComp: CatComp };
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
		@InjectRepository(PeriodosRepo)
		private readonly periodRepo: PeriodosRepo,
	) {}

	@Get('all')
	async getAll(): Promise<UsrWithOrgani[]> {
		const workers = await this.trabRepo.find({
			relations: ['periodos', 'periodos.catComp', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
		const organiFull: UsrWithOrgani[] = workers.map(wrk => {
			//Filtro el periodo al actual
			wrk.periodos = wrk.periodos.filter(per => per.actual);
			const org: UsrWithOrgani = {
				inferiores: wrk.periodos[0].inferiores,
				superiores: wrk.periodos[0].superiores,
				pares: wrk.periodos[0].pares,
				trabajador: wrk as Trabajador & { catComp: CatComp },
			};
			org.trabajador.catComp = wrk.periodos[0].catComp;
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

	@Post('inferiores/:dni')
	async setInferiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'inferiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'superiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'inferiores', 'add');
		// return this.addRelation(dni, relations, 'addinf');
	}

	@Post('superiores/:dni')
	async setSuperiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'superiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'inferiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'superiores', 'add');
		// return this.addRelation(dni, relations, 'addsup');
	}

	@Post('pares/:dni')
	async setPares(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'pares');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'pares')));
		return this.changeRelations(trab, relsOfTrab, true, 'pares', 'add');
		// return this.addRelation(dni, relations, 'addpar');
	}

	@Delete('pares/:dni')
	async deletePares(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'pares');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'pares')));
		return this.changeRelations(trab, relsOfTrab, true, 'pares', 'remove');
		// return this.removeRelations(trab, relsOfTrab, true, 'pares');
	}

	@Delete('inferiores/:dni')
	async deleteInferiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'inferiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'superiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'inferiores', 'remove');
		// return this.removeRelations(trab, relsOfTrab, true, 'inferiores');
	}

	@Delete('superiores/:dni')
	async deleteSuperiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'superiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'inferiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'superiores', 'remove');
		// return this.removeRelations(trab, relsOfTrab, true, 'superiores');
	}

	/**
	 * @param dni El dni con el que se buscará al trabajador en la bbdd
	 * @param relKey La relación que se quiere cargar de este trabajador (inf|sup|par)
	 * @returns El trabajador con sus relaciones
	 */
	private async parseTrab(dni: string, relKey: 'inferiores' | 'superiores' | 'pares') {
		const trab = await this.trabRepo.findOne(
			{ dni: dni },
			{
				relations: ['periodos', 'periodos.catContr', 'periodos.catComp', `periodos.${relKey}`],
			},
		);
		if (!trab) throw new BadRequestException();
		return trab;
	}

	//TODO: Creo que funciona sin bugs pero hay que cambiar unas cuantas cosas para que no haya posibilidad a que falle si en la bbdd se modifican los datos a mano.
	/**
	 *  Elimina las relaciones de un trabajador
	 * @param trab	El trabajador del cual se quieren añadir/eliminar relaciones
	 * @param relations Las relaciones a añadir/eliminar
	 * @param relType El tipo de relación que se va a añadir/eliminar
	 * @param recursive `True` si el metodo ha de ejecutarse otra vez para las relaciones del `trab`
	 * @param relationsType El tipo de relaciones como string
	 * @param addOrRemove Add si se quiere añadir relaciones y remove si se quieren añadir/eliminar
	 * @returns Una promesa de tipo boolean, `true` si se han añadido/eliminado correctamente las relaciones, `false` en caso contrario
	 */
	private async changeRelations(
		trab: Trabajador,
		relations: Trabajador[],
		recursive: boolean,
		relationsType: 'inferiores' | 'superiores' | 'pares',
		addOrRemove: 'add' | 'remove',
	): Promise<boolean> {
		/** Dates de utilidad en el metodo */
		const d8s = {
			/** Fecha limite, (now - dias permitidos para no crear nuevos periodos) */
			deadline: new Date(new Date().setDate(-30)),
			now: new Date(),
		};
		const relTypeReversed = (() => {
			switch (relationsType) {
				case 'inferiores':
					return 'superiores';
				case 'pares':
					return 'pares';
				case 'superiores':
					return 'inferiores';
			}
		})();
		/** Periodo actual de `trab` */
		const actualPeri = trab.periodos.filter(p => p.actual)[0];
		if (!actualPeri) {
			return false;
		}
		if (actualPeri.createdAt < d8s.deadline) {
			//Finalizo periodo actual
			actualPeri.actual = false;
			actualPeri.endAt = d8s.now;
			await this.periodRepo.save(actualPeri);
			//Actualizo relaciones del trab
			['id', 'endAt', 'createdAt'].forEach(p => delete actualPeri[p]);
			actualPeri.actual = true;
			delete trab.periodos;
			actualPeri.trabajador = trab;
			this.concatenateRelations(addOrRemove, relations, actualPeri, relationsType);
			await actualPeri.save();
			//Actualizo a los trabajadores que tienen a trab como relación
			await Promise.all(relations.map(rel => this.changeRelations(rel, [trab], false, relTypeReversed, addOrRemove)));
		} else {
			//Actualizo relaciones del trab
			delete trab.periodos;
			actualPeri.trabajador = trab;
			this.concatenateRelations(addOrRemove, relations, actualPeri, relationsType);
			await actualPeri.save();
			if (!recursive) {
				return true;
			}
			//Actualizo a los trabajadores que tienen a trab como relación
			await Promise.all(relations.map(rel => this.changeRelations(rel, [trab], false, relTypeReversed, addOrRemove)));
		}
		return true;
	}

	/**
	 * Añade o quita los elementos que tiene el array `relations` del Periodo dado como parametro.
	 * @param add `True` si se quiere añadir al periodo las `relations`
	 * @param relations Las relaciones a añadir de tipo `Inferiores` `Superiores` `Pares`
	 * @param wrkPeriodo El periodo del trabajador
	 * @param relType
	 */
	private concatenateRelations(
		addOrRemove: 'add' | 'remove',
		relations: Trabajador[],
		wrkPeriodo: PeriodoTrab,
		relType: 'inferiores' | 'superiores' | 'pares',
	): void {
		if (!wrkPeriodo[relType]) throw new Error('No se han cargado las relaciones correctamente');
		if (addOrRemove === 'add') {
			wrkPeriodo[relType] = wrkPeriodo[relType].concat(relations);
		} else {
			relations.forEach(rel => {
				const indx = wrkPeriodo[relType].findIndex(r => r.dni === rel.dni);
				wrkPeriodo[relType].splice(indx, 1);
			});
		}
	}
}
