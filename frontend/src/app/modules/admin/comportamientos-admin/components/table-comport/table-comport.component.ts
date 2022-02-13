import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';
import { findNivelById, findCompById } from 'sharedCode/Utility';
import { DbData } from 'src/app/types/data';
import { LogService } from 'src/app/shared/log/log.service';
import { ComportService, CompetenciasService, NivelService } from 'services/data';
import { ICompGetDTO, IComportGetDTO, INivelGetDTO } from 'sharedInterfaces/DTO';

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
	comportsToAdd: IComportamiento[] = [];
	dbData = {
		comps: [] as ICompGetDTO[],
		comports: [] as IComportGetDTO[],
		niveles: [] as INivelGetDTO[],
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
	/** All component subscriptions */
	#subs: Subscription[] = [];

	constructor(
		private readonly comportService: ComportService,
		private readonly compSv: CompetenciasService,
		private readonly nivSv: NivelService,
		private readonly logger: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente TableComportComponent');
		this.logger.verbose('Obteniendo todos los datos de la bbdd para funcionar');
		const [comports, comps, niveles] = await Promise.all([
			this.comportService.getAll(),
			this.compSv.getAll(),
			this.nivSv.getAll(),
		]);
		this.dbData.comports = comports;
		this.comportsFiltered = comports;
		this.dbData.comps = comps;
		this.dbData.niveles = niveles;
		//Añado la descripción modificada por cada comportamiento al objeto key/value comportPlainDesc
		this.dbData.comports.forEach(
			comport =>
				(this.cv.util4Filters.comportPlainDesc[comport.id] = comport.descripcion
					.toLowerCase()
					.replace(/\s/g, '')),
		);
		//Se añaden las suscripciones a un array para eliminarlas mas facil despues
		this.#subs.push(
			this.cv.filters.nivObs.subscribe(() => (this.comportsFiltered = this.filterByAll())),
			this.cv.filters.compObs.subscribe(() => (this.comportsFiltered = this.filterByAll())),
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
		const borrado = await this.comportService.delete(comport);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateComportView();
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
		if (!!filters.compObs.value) {
			comports = this.filterByComp(filters.compObs.value, comports);
		}
		comports = this.filterByDesc(filters.descObs.value, comports);
		if (!!filters.nivObs.value) {
			comports = this.filterByNivel(filters.nivObs.value, comports);
		}

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
		this.logger.debug(`Filtrando comportamientos con ID de nivel: ${nivel.id}`, nivel);
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[1] === String(nivel.valor);
		});
	}
	/**
	 * Filtra por competencia la lista de comportamientos
	 *
	 * @param comp la competencia por la que queremos filtrar
	 * @param composrts un array con los comportamientos
	 * @returns devuelve un array de comportamientos que coinciden con la busqueda de la competencia
	 */
	filterByComp(comp: ICompetencia, comports: IComportamiento[]): IComportamiento[] {
		this.logger.debug(`Filtrando comportamientos por id de competencia: ${comp.id}`, comp);
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[0] === String(comp.id);
		});
	}
}
