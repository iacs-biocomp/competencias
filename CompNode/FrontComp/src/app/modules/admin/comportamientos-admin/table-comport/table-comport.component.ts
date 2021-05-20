import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { DbData } from '../../evaluaciones-admn/modelos/new-ev-model.component';
import { NivelService } from '../../niveles-admin/services/nivel.service';
import { ComportService } from '../services/comport.service';

type ComportCtrlView = {
	filters: {
		nivObs: BehaviorSubject<INivel | undefined>;
		compObs: BehaviorSubject<ICompetencia | undefined>;
		descObs: BehaviorSubject<string>;
	};
	/** Objeto que tiene datos de utilidad para los filtros como timers o Comportamientos con la descripción ya modificada para buscar mas rapido */
	util4Filters: {
		/** Objeto key/value que tiene el id de un comportamiento y su descripción modificada (sin espacios y lowercase) */
		comportPlainDesc: { [key: string]: string };
	};
};
interface IComportEdit extends IComportamiento {
	editing?: boolean;
}

@Component({
	selector: 'app-table-comport',
	templateUrl: './table-comport.component.html',
	styleUrls: ['./table-comport.component.css'],
})
export class TableComportComponent implements OnInit, OnDestroy {
	comportToAdd: IComportamiento[] = [];
	//TODO: Eliminar
	//TODO: Como varias vistas utilizan datos de la bbdd para hacer calculos seria preferible crear un servicio que tiene estos datos y los componentes leen de ahi en vez de pedir varias veces al backend, los componentes deciden cuando actualizar esos datos
	//TODO: Generar interfaz en interfaces del frontend, DbData se utiliza en muchos componentes
	dbData: Omit<DbData, 'modelToAdd' | 'catComps'> = {
		comps: [],
		comports: [],
		niveles: [],
	};

	comportsFiltered: IComportEdit[] = [];
	cv: ComportCtrlView = {
		filters: {
			nivObs: new BehaviorSubject<INivel | undefined>(undefined),
			compObs: new BehaviorSubject<ICompetencia | undefined>(undefined),
			descObs: new BehaviorSubject<string>(''),
		},
		util4Filters: {
			/** Objeto key/value que tiene el id de un comportamiento y su descripción modificada (sin espacios y lowercase) */
			comportPlainDesc: {},
		},
	};
	//TODO: Tsdoc (Array suscripciones)
	subs: Subscription[] = [];
	constructor(
		private comportService: ComportService,
		private compSv: CompetenciasService,
		private nivSv: NivelService,
	) {}

	async ngOnInit(): Promise<void> {
		//Obtengo todos los datos de la bbdd necesarios para funcionar
		const promises = await Promise.all([
			this.comportService.getAll(),
			this.compSv.getAll(),
			this.nivSv.getAll(),
		]);
		this.dbData.comports = promises[0];
		this.comportsFiltered = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		//Añado la descripción modificada por cada comportamiento al objeto key/value comportPlainDesc
		this.dbData.comports.forEach(
			comport =>
				(this.cv.util4Filters.comportPlainDesc[comport.id] = comport.descripcion
					.toLowerCase()
					.replace(/\s/g, '')),
		);
		//Se añaden las suscripciones a un array para eliminarlas mas facil despues
		this.subs.push(
			this.cv.filters.nivObs.subscribe(() => (this.comportsFiltered = this.filterByAll())),
			this.cv.filters.compObs.subscribe(() => (this.comportsFiltered = this.filterByAll())),
			this.cv.filters.descObs.subscribe(() => {
				this.comportsFiltered = this.filterByAll();
			}),
		);
	}

	ngOnDestroy(): void {
		//Se desuscribe de todos los observables para evitar memory leaks
		this.subs.forEach(s => s.unsubscribe());
	}

	/** Metodo que sincroniza la vista con el backend (La lista de comportamiento) */
	async updateComportView(): Promise<void> {
		this.dbData.comports = await this.comportService.getAll();
	}

	deleteComptToAdd(row: IComportamiento): void {
		const indx = this.comportToAdd.indexOf(row);
		this.comportToAdd.splice(indx, 1);
	}

	/** Añade un nuevo comportamiento al array de comportToAdd */
	newEmptyCompt(): void {
		this.comportToAdd.push({
			id: '',
			descripcion: '',
			subModels: undefined,
		});
	}

	/**
	 *
	 * @param compet La competencia a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa competencia al backend `false` si no
	 */
	editingComport(comport: IComportEdit, editing: boolean, send: boolean): void {
		comport.editing = editing;
		if (send) {
			delete comport.editing;
			this.comportService.editCompt(comport);
		}
	}

	canDelete(comport: IComportamiento): boolean {
		return true;
	}

	async persistComport(comport: IComportamiento): Promise<void> {
		const guardado = await this.comportService.addComport(comport);
		if (guardado) {
			await this.updateComportView();
			this.deleteComptToAdd(comport);
		}
	}

	async deleteComport(comport: IComportamiento) {
		const borrado = await this.comportService.delete(comport);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateComportView();
		}
	}

	//TODO tsdoc, devuelve el INivel con el identificador dado por parametroo o undefined si no hay un nivel con ese identificador en el array dado
	//TODO: Enviar a carpeta interfaces ya que esta función puede ser usada por backend y frontend, es de ayuda para mapear un dto a entidades de tipo INivel
	findNivelById(niveles: INivel[], nivId: string): INivel | undefined {
		return niveles.find(nivel => nivel.id === nivId);
	}

	//TODO tsdoc, devuelve la ICompetencia con el identificador dado por parametroo o undefined si no hay una competencia con ese identificador en el array dado
	//TODO: Enviar a carpeta interfaces ya que esta función puede ser usada por backend y frontend, es de ayuda para mapear un dto a entidades de tipo ICompetencia
	findCompById(competencias: ICompetencia[], compId: string): ICompetencia | undefined {
		return competencias.find(comp => comp.id === compId);
	}

	/**
	 * Filtra los comportamientos sumando todas las funciones de filtro, estan hardcodeados los Observables de los que se obtienen los valores
	 * @returns TODO: Complete
	 */
	filterByAll(): IComportamiento[] {
		console.time('filterByAll');
		const filters = this.cv.filters;
		let comports = this.dbData.comports;
		console.log('filterByAllcalled');
		if (!!filters.compObs.value) {
			comports = this.filterByComp(filters.compObs.value, comports);
		}
		comports = this.filterByDesc(filters.descObs.value, comports);
		if (!!filters.nivObs.value) {
			comports = this.filterByNivel(filters.nivObs.value, comports);
		}
		console.timeEnd('filterByAll');

		return comports;
	}

	/**
	 * Filtra por descripcion los comportamientos para la busqueda
	 * @param desc descripcion a buscar (palabra, letra, etc)
	 * @param comports array de comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la descripción
	 */
	filterByDesc(desc: string, comports: IComportamiento[]): IComportamiento[] {
		if (desc === '') return comports;
		return comports.filter(comport => {
			const filterValue = desc.toLowerCase().replace(/\s/g, '');
			return this.cv.util4Filters.comportPlainDesc[comport.id].includes(filterValue) ? true : false;
		});
	}

	/**
	 * Filtra por nivel los comportamientos para la busqueda
	 * @param nivel el nivel que queremos encontrar
	 * @param comports array de comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda del nivel
	 */
	filterByNivel(nivel: INivel, comports: IComportamiento[]): IComportamiento[] {
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[1] === String(nivel.valor);
		});
	}
	/**
	 * Filtra por competencia la lista de comportamientos
	 * @param comp la competencia por la que queremos filtrar
	 * @param comports un array con los comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la competencia
	 */
	filterByComp(comp: ICompetencia, comports: IComportamiento[]): IComportamiento[] {
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[0] === String(comp.id);
		});
	}
}
