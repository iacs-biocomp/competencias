import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { DbData } from '../../evaluaciones-admn/modelos/new-ev-model.component';
import { NivelService } from '../../niveles-admin/services/nivel.service';
import { ComportService } from '../services/comport.service';

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
	// TODO: Eliminar
	/**
	 * @deprecated Usar dbData.comports
	 */
	comports: IComportEdit[] = [];
	//TODO: Como varias vistas utilizan datos de la bbdd para hacer calculos seria preferible crear un servicio que tiene estos datos y los componentes leen de ahi en vez de pedir varias veces al backend, los componentes deciden cuando actualizar esos datos
	//TODO: Generar interfaz en interfaces del frontend, DbData se utiliza en muchos componentes
	dbData: Omit<DbData, 'modelToAdd' | 'catComps'> = {
		comps: [],
		comports: [],
		niveles: [],
	};

	comportsFiltered: IComportEdit[] = [];
	cv = {
		filters: {
			nivObs: new BehaviorSubject<INivel | undefined>(undefined),
			compObs: new BehaviorSubject<ICompetencia | undefined>(undefined),
			descObs: new BehaviorSubject<string>(''),
		},
	};
	subs: Subscription[] = [];
	constructor(
		private comportService: ComportService,
		private compSv: CompetenciasService,
		private nivSv: NivelService,
	) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.comportService.getAll(),
			this.compSv.getAll(),
			this.nivSv.getAll(),
		]);
		this.comports = promises[0];
		this.dbData.comports = promises[0];
		this.comportsFiltered = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.subs.push(
			this.cv.filters.nivObs.subscribe(niv => {
				if (!niv) return;
				this.comportsFiltered = this.filterByNivel(niv, this.dbData.comports);
			}),
			this.cv.filters.compObs.subscribe(comp => {
				if (!comp) return;
				this.comportsFiltered = this.filterByComp(comp, this.dbData.comports);
			}),
			this.cv.filters.descObs.subscribe(descFilterTxt => {
				const txtToFilter = descFilterTxt === undefined ? '' : descFilterTxt;
				console.log('hola');
				console.time('filterByDesc');
				this.comportsFiltered = this.filterByDesc(txtToFilter, this.dbData.comports);
				console.timeEnd('filterByDesc');
			}),
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(s => s.unsubscribe());
	}

	/** Metodo que sincroniza la vista con el backend (La lista de comportamiento) */
	async updateComportView(): Promise<void> {
		this.comports = await this.comportService.getAll();
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

	findNivelById(niveles: INivel[], nivId: string): INivel | undefined {
		return niveles.find(nivel => nivel.id === nivId);
	}

	findCompById(competencias: ICompetencia[], compId: string): ICompetencia | undefined {
		return competencias.find(comp => comp.id === compId);
	}
	filterByDesc(desc: string, comports: IComportamiento[]): IComportamiento[] {
		if (desc === '') return comports;
		return comports.filter(comport => {
			const filterValue = desc.toLowerCase().replace(/\s/g, '');
			return comport.descripcion.includes(filterValue) ? true : false;
		});
	}
	filterByNivel(nivel: INivel, comports: IComportamiento[]): IComportamiento[] {
		//TODO: La función de filtrado debería ser por relacion en bdd (fk en tabla comportamiento) en vez de usar el codigo
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[1] === String(nivel.valor);
		});
	}
	filterByComp(comp: ICompetencia, comports: IComportamiento[]): IComportamiento[] {
		//TODO: La función de filtrado debería ser por relacion en bdd (fk en tabla comportamiento) en vez de usar el codigo
		return comports.filter(comport => {
			const idSplited = comport.id.split('.');
			return idSplited[0] === String(comp.id);
		});
	}
}
