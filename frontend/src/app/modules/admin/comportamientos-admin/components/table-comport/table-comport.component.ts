import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { findNivelById, findCompById } from 'sharedCode/Utility';
import { LogService } from 'src/app/shared/log/log.service';
import { ComportService, CompetenciasService, NivelService } from 'services/data';
import { ICompGetDTO, IComportGetDTO, INivelGetDTO } from 'sharedInterfaces/DTO';
import { remove } from 'lodash';

type ComportCtrlView = {
	filters: {
		descObs: BehaviorSubject<string>;
	};
	/** Datos de utilidad para los filtros como timers o Comportamientos con la desc ya modificada */
	util4Filters: {
		/** Objeto key/value que tiene el id de un comportamiento y su descripción modificada (sin espacios y lowercase) */
		behaviourDescriptions: Map<string, string>;
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
	comportsToAdd: IComportamiento[] = [];
	dbData = {
		comps: [] as ICompGetDTO[],
		comports: [] as IComportGetDTO[],
		niveles: [] as INivelGetDTO[],
	};

	comportsFiltered: IComportEdit[] = [];
	cv: ComportCtrlView = {
		filters: {
			descObs: new BehaviorSubject<string>(''),
		},
		util4Filters: {
			/** Map with behaviours descriptions transformed (no spaces and to lower) */
			behaviourDescriptions: new Map(),
		},
	};
	/** All component subscriptions */
	#subs: Subscription[] = [];

	constructor(
		private readonly comportService: ComportService,
		private readonly compSv: CompetenciasService,
		private readonly nivSv: NivelService,
		private readonly logger: LogService,
	) {}

	ngOnInit(): void {
		this.logger.verbose('Cargando componente TableComportComponent');
		this.logger.verbose('Obteniendo todos los datos de la bbdd para funcionar');
		// TODO: Update component, pass data on component props (@Input)
		(async () => {
			const comportPromise = this.comportService.getAll();
			[this.dbData.comports, this.comportsFiltered, this.dbData.comps, this.dbData.niveles] =
				await Promise.all([comportPromise, comportPromise, this.compSv.getAll(), this.nivSv.getAll()]);
			//Initialization of behaviourDescriptions map
			this.dbData.comports.forEach(comport =>
				this.cv.util4Filters.behaviourDescriptions.set(
					comport.id,
					comport.descripcion.toLowerCase().replace(/\s/g, ''),
				),
			);
		})();
		//Se añaden las suscripciones a un array para eliminarlas mas facil despues
		this.#subs.push(
			this.cv.filters.descObs.subscribe(() => {
				this.comportsFiltered = this.filterByAll();
			}),
		);
	}

	ngOnDestroy(): void {
		this.logger.verbose('Destruyendo TableComportComponent');
		this.#subs.forEach(s => s.unsubscribe());
	}

	/** Metodo que sincroniza la vista con el backend (La lista de comportamiento) */
	async updateComportView(): Promise<void> {
		this.logger.verbose('Actualizando vista del componente TableComportComponent');
		this.dbData.comports = await this.comportService.getAll();
	}

	deleteComptToAdd(comport: IComportamiento): void {
		this.logger.verbose('Eliminando comportamiento no añadido', comport);
		const indx = this.comportsToAdd.indexOf(comport);
		this.comportsToAdd.splice(indx, 1);
	}

	/** Añade un nuevo comportamiento al array de comportToAdd */
	addEmptyComport(): void {
		this.logger.verbose('Creando fila vacía para añadir comportamiento');
		this.comportsToAdd.push({
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
		this.logger.debug(`Editando comportamiento con ID: ${comport.id}`, comport);
		comport.editing = editing;
		if (send) {
			delete comport.editing;
			this.comportService.edit(comport);
			this.logger.verbose('Enviando comportamiento al backend');
		}
	}

	//TODO ???: falta terminar función, igual que table-competencias (comprobar que la competencia tiene más de 7 días desde la fecha de creacion)
	canDelete(comport: IComportamiento): boolean {
		this.logger.verbose('Comprobando si se puede borrar el comportamiento');
		return true;
	}

	async persistComport(comport: IComportamiento): Promise<void> {
		const guardado = await this.comportService.add(comport);
		this.logger.debug(`Guardando comportamiento creado con ID: ${comport.id}`, comport);
		if (guardado) {
			await this.updateComportView();
			this.deleteComptToAdd(comport);
			this.comportsFiltered = this.filterByAll();
			this.logger.verbose('Comportamiento guardado correctamente en la lista all comports');
		}
	}

	async deleteComport(comport: IComportamiento) {
		this.logger.debug(`Eliminando comportamiento con ID: ${comport.id}`);
		const deleted = await this.comportService.delete(comport);
		if (deleted) {
			remove(this.dbData.comports, x => x.id === comport.id);
			this.comportsFiltered = this.filterByAll();
			this.logger.verbose('Comportamiento eliminado con éxito');
		}
	}

	/**
	 * Filtra los comportamientos sumando todas las funciones de filtro, estan hardcodeados los Observables de los que se obtienen los valores
	 *
	 * @returns comports filtered
	 */
	filterByAll(): IComportamiento[] {
		this.logger.verbose('Filtrando comportamientos');
		const filters = this.cv.filters;
		let comports = this.dbData.comports;
		comports = this.filterByDesc(filters.descObs.value, comports);
		return comports;
	}

	/**
	 * Filtra por descripcion los comportamientos para la busqueda
	 *
	 * @param desc descripcion a buscar (palabra, letra, etc)
	 * @param comports Comportamientos a filtrar
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la descripción
	 */
	filterByDesc(desc: string, comports: IComportamiento[]): IComportamiento[] {
		this.logger.debug(`Filtrando comportamientos con descripcion: ${desc}`, {
			listaComportsParaFiltrar: comports,
		});
		if (desc === '') {
			this.logger.verbose('Descripción vacía, devolviendo la lista completa de comportamientos');
			return comports;
		}
		return comports.filter(comport => {
			const filterValue = desc.toLowerCase().replace(/\s/g, '');
			return this.cv.util4Filters.behaviourDescriptions.get(comport.id)?.includes(filterValue) ? true : false;
		});
	}
}
