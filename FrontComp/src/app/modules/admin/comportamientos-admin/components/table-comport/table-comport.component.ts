import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../../../../../services/data/competencias.service';
import { NivelService } from '../../../../../services/data/nivel.service';
import { ComportService } from '../../../../../services/data/comport.service';
import { findNivelById, findCompById } from 'sharedCode/Utility';
import { DbData } from 'src/app/types/data';

type ComportCtrlView = {
	filters: {
		nivObs: BehaviorSubject<INivel | undefined>;
		compObs: BehaviorSubject<ICompetencia | undefined>;
		descObs: BehaviorSubject<string>;
	};
	/** Datos de utilidad para los filtros como timers o Comportamientos con la desc ya modificada */
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
	styleUrls: ['./table-comport.component.scss'],
})
export class TableComportComponent implements OnInit, OnDestroy {
	comportToAdd: IComportamiento[] = [];
	dbData: Omit<DbData, 'cComps'> = {
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
	/** Array de todas las suscripciones realizadas en este componente */
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
		//LOG: `se actualiza la vista de los comportamientos`
		this.dbData.comports = await this.comportService.getAll();
	}

	deleteComptToAdd(row: IComportamiento): void {
		//LOG: `se elimina un comport ${row}`
		const indx = this.comportToAdd.indexOf(row);
		this.comportToAdd.splice(indx, 1);
	}

	/** Añade un nuevo comportamiento al array de comportToAdd */
	newEmptyCompt(): void {
		//LOG: `se añade un comport vacio`
		this.comportToAdd.push({
			id: '',
			descripcion: '',
			subModels: undefined,
		});
	}

	findNivelById = findNivelById;
	findCompById = findCompById;

	/**
	 *
	 * @param compet La competencia a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa competencia al backend `false` si no
	 */
	editingComport(comport: IComportEdit, editing: boolean, send: boolean): void {
		//LOG: `se edita un comport ${comport}, ${editing}, ${send}`
		comport.editing = editing;
		if (send) {
			delete comport.editing;
			this.comportService.edit(comport);
		}
	}

	canDelete(comport: IComportamiento): boolean {
		//LOG: `se comprueba si se puede eleminar un comport ${comport}`
		return true;
	}

	async persistComport(comport: IComportamiento): Promise<void> {
		//LOG: `se persiste un comport ${comport}`
		const guardado = await this.comportService.add(comport);
		if (guardado) {
			await this.updateComportView();
			this.deleteComptToAdd(comport);
			this.comportsFiltered = this.filterByAll();
		}
	}

	async deleteComport(comport: IComportamiento) {
		//LOG: `se elimina un comport ${comport}`
		const borrado = await this.comportService.delete(comport);
		console.log('delete');
		console.log(borrado);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateComportView();
			this.comportsFiltered = this.filterByAll();
		}
	}

	/**
	 * Filtra los comportamientos sumando todas las funciones de filtro, estan hardcodeados los Observables de los que se obtienen los valores
	 *
	 * @returns comports filtered
	 */
	filterByAll(): IComportamiento[] {
		//LOG: `se filtran los comport`
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
	 *
	 * @param desc descripcion a buscar (palabra, letra, etc)
	 * @param comports array de comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la descripción
	 */
	filterByDesc(desc: string, comports: IComportamiento[]): IComportamiento[] {
		//LOG: `se filtra por descripcion la lista de comports ${desc}, ${comports}`
		if (desc === '') {
			return comports;
		}
		return comports.filter(comport => {
			const filterValue = desc.toLowerCase().replace(/\s/g, '');
			return this.cv.util4Filters.comportPlainDesc[comport.id].includes(filterValue) ? true : false;
		});
	}

	/**
	 * Filtra por nivel los comportamientos para la busqueda
	 *
	 * @param nivel el nivel que queremos encontrar
	 * @param comports array de comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda del nivel
	 */
	filterByNivel(nivel: INivel, comports: IComportamiento[]): IComportamiento[] {
		//LOG: `se filtra por nivel la lista de comports ${nivel}, ${comports}`
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[1] === String(nivel.valor);
		});
	}
	/**
	 * Filtra por competencia la lista de comportamientos
	 *
	 * @param comp la competencia por la que queremos filtrar
	 * @param comports un array con los comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la competencia
	 */
	filterByComp(comp: ICompetencia, comports: IComportamiento[]): IComportamiento[] {
		//LOG: `se filtra por competencia la lista de comports ${comp}, ${comports}`
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[0] === String(comp.id);
		});
	}
}
