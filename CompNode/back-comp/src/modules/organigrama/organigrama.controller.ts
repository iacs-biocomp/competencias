import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PeriodosRepo } from '../trabajadores/periodos.repository';
import { TrabajadorRepo } from '../trabajadores/trabajador.repository';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { CatComp, PeriodoTrab, Trabajador } from 'src/entity';
import { ITrabajador } from 'sharedInterfaces/Entity';
import { IOrganigramaUsrDTO } from 'sharedInterfaces/DTO';
interface Organigrama {
	inferiores: Trabajador[];
	superiores: Trabajador[];
	pares: Trabajador[];
}

interface UsrWithOrgani extends Organigrama {
	trabajador: TrabWithCComp;
}
/** Trabajador con propiedad añadida catComp () */
type TrabWithCComp = Trabajador & { catComp: CatComp };
type RelType = 'inferiores' | 'superiores' | 'pares';

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
	async getAll(): Promise<IOrganigramaUsrDTO[]> {
		const workers = await this.trabRepo.find({
			relations: ['periodos', 'periodos.catComp', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
		return workers.map(wrk => {
			//Filtro el periodo al actual
			wrk.periodos = wrk.periodos.filter(per => per.actual);
			return {
				inferiores: wrk.periodos[0].inferiores,
				superiores: wrk.periodos[0].superiores,
				pares: wrk.periodos[0].pares,
				trabajador: (() => {
					const cComp = wrk.periodos[0].catComp;
					//Borro los periodos de cada trabajador (Info no necesaria)
					delete wrk.periodos;
					return { ...wrk, catComp: cComp };
				})(),
			};
		});
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
		return {
			inferiores: actualPer.inferiores,
			superiores: actualPer.superiores,
			pares: actualPer.pares,
		};
	}

	@Post('inferiores/:dni')
	async setInferiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'inferiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'superiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'inferiores', 'add');
	}

	@Post('superiores/:dni')
	async setSuperiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'superiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'inferiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'superiores', 'add');
	}

	@Post('pares/:dni')
	async setPares(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'pares');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'pares')));
		return this.changeRelations(trab, relsOfTrab, true, 'pares', 'add');
	}

	@Delete('pares/:dni')
	async deletePares(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'pares');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'pares')));
		return this.changeRelations(trab, relsOfTrab, true, 'pares', 'remove');
	}

	@Delete('inferiores/:dni')
	async deleteInferiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'inferiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'superiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'inferiores', 'remove');
	}

	@Delete('superiores/:dni')
	async deleteSuperiores(@Param('dni') dni: string, @Body() relations: ITrabajador[]): Promise<boolean> {
		const trab = await this.parseTrab(dni, 'superiores');
		const relsOfTrab = await Promise.all(relations.map(rel => this.parseTrab(rel.dni, 'inferiores')));
		return this.changeRelations(trab, relsOfTrab, true, 'superiores', 'remove');
	}

	/**
	 * @param dni El dni con el que se buscará al trabajador en la bbdd
	 * @param relKey La relación que se quiere cargar de este trabajador (inf|sup|par)
	 * @returns El trabajador con sus relaciones
	 */
	private async parseTrab(dni: string, relKey: RelType) {
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
		relationsType: RelType,
		addOrRemove: 'add' | 'remove',
	): Promise<boolean> {
		/** Dates de utilidad en el metodo */
		const d8s = {
			/** Fecha limite, (now - dias permitidos para no crear nuevos periodos) */
			deadline: new Date(new Date().setDate(-30)),
			now: new Date(),
		};
		/** La inversa del parametro relationsType */
		const relTypeReversed = this.reverseRelType(relationsType);
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
			if (recursive) {
				//Actualizo a los trabajadores que tienen a trab como relación
				await Promise.all(relations.map(rel => this.changeRelations(rel, [trab], false, relTypeReversed, addOrRemove)));
			}
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
		relType: RelType,
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
	private reverseRelType(relation: RelType): RelType {
		switch (relation) {
			case 'inferiores':
				return 'superiores';
			case 'pares':
				return 'pares';
			case 'superiores':
				return 'inferiores';
		}
	}
}
