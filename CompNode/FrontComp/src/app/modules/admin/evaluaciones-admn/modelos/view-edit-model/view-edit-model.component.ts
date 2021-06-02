import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { findSubModels, getAllComportsOfComp, getCompetOfModel } from 'sharedCode/Utility';
import { IModelBasicIndxDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../../../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../../../competencias-admin/services/competencias.service';
import { ComportService } from '../../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../../niveles-admin/services/nivel.service';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';
import { DbData } from '../new-ev-model.component';

type ComportCtrlView = {
	/** Tipo que agrupa una competencia, un nivel y un array de comportamientos */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsToShow: IComportamiento[];
};

//TODO: Cambiar nombre elegir el correcto
type CvChangeMyName = {
	//TODO: Tsdoc
	modelView: IRefModel;
	competenciasModelo: ICompetencia[] | undefined;
};

/** Este componente esta destinado a la visualización y edición de un modelo, según que parametro se le pase mostrará o no el Añadir/Eliminar comportamiento */
@Component({
	selector: 'app-view-edit-model [modoEdicion] [evModel]',
	templateUrl: './view-edit-model.component.html',
	styleUrls: ['./view-edit-model.component.scss'],
})
export class ViewEditModelComponent implements OnInit {
	/** Indica si el componente ha sido inicializado y se puede renderizar la vista */
	initialized = false;
	dbData!: Omit<DbData, 'modelToAdd'>;
	@Input() modoEdicion!: boolean;
	@Input() evModel!: BehaviorSubject<IRefModel>;
	preSelectedComps: ICompetencia[] = [];

	cv!: CvChangeMyName;
	/** Modelo que se obtiene cuando el componente se inicia del evModel pasado como input */
	evModelIndx!: IModelBasicIndxDTO;
	/** Objeto que tiene los datos usados para los select */
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsToShow: [],
	};
	compsObs!: BehaviorSubject<ICompetencia[]>;

	subs: Subscription[] = [];

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
		private evModelSv: EvModelsAdmnService,
	) {}

	/** Función que se ejecuta cuando se va a construir el componente,
	 * al ser asincrona la vista no debe mostrarse si este metodo no ha acabado*/
	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAll(),
			this.comportSv.getAll(),
			this.nivSv.getAllRefNivs(),
		]);
		this.dbData = {
			catComps: promises[0],
			comps: promises[1],
			comports: promises[2],
			niveles: promises[3],
		};
		this.compsObs = new BehaviorSubject(this.dbData.comps);
		this.subs.push(
			this.evModel.subscribe(model => {
				this.evModelIndx = this.mapIRefModelToIndexed(model);
				this.cv = {
					modelView: model,
					competenciasModelo: this.getCompet(model),
				};
				this.preSelectedComps = getCompetOfModel(model);
			}),
		);
		this.initialized = true;
	}

	//Se redeclaran para que la vista pueda acceder a ellas
	findSubModels = findSubModels;
	getAllComportsOfComp = getAllComportsOfComp;
	getCompet = getCompetOfModel;

	/**
	 * Mapea un modelo de tipo IRefModel a IModelBasicIndxDTO
	 * @param modelToMap Modelo de tipo IRefModel (Con subModelos) que se quiere mapear
	 * @returns El modelo mapeado
	 */
	mapIRefModelToIndexed(modelToMap: IRefModel): IModelBasicIndxDTO {
		let model: Partial<IModelBasicIndxDTO> = {};
		model.id = modelToMap.id;
		model.catComp = modelToMap.catComp;
		model.comps = {};
		/** Array de competencias del modelo */
		const competencias: ICompetencia[] = this.getCompet(modelToMap);
		competencias.forEach(c => {
			const comportsOfC = this.getAllComportsOfComp(c, modelToMap.subModels);
			model.comps![c.id] = { descripcion: c.descripcion, comports: {} };
			comportsOfC.forEach(comport => {
				model.comps![c.id].comports[comport.id] = { descripcion: comport.descripcion };
			});
		});
		return model as IModelBasicIndxDTO;
	}
	/**
	 * @param subModels El array de submodelos en el que se busca el submodelo
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
	 */
	findSubModel(subModels: ISubModel[], comp: ICompetencia, niv: INivel): ISubModel | undefined {
		return subModels.find(subModel => subModel.competencia?.id === comp.id && subModel.nivel?.id === niv.id);
	}

	/**
	 * @deprecated Usar subModelos y sus funciones
	 */
	keysToArrayComport(comportIndxObj: { [key: string]: { descripcion: string } }): { descripcion: string }[] {
		let arrayOfComports: { descripcion: string }[];
		arrayOfComports = Object.keys(comportIndxObj).map(key => comportIndxObj[key]);
		return arrayOfComports;
	}

	/**Devuelve un string el cual es identificador de un elemento html que tiene la clase collapsable */
	collapseId(compId: string, nivelCode: string) {
		return `coll${compId.replace('\u0027', '')}${nivelCode}`;
	}

	//TODO: Añadir tsdoc y llevar a utility, parametrizar con IComport en vez de ISubModel
	filterNonSelectedComports(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		const comportsOfComp = this.getAllComportsOfComp(comp, subModels);
		/** Numero de comportamientos ya excluidos, si es igual a comportsOfComp.lenght-1 romper el filtro (innecesaio) */
		let nExcluded = 0;
		return this.dbData.comports.filter(dbComport => {
			if (nExcluded !== comportsOfComp.length - 1) {
				return !comportsOfComp.find(c4filter => c4filter.id === dbComport.id);
			} else {
				return true;
			}
		});
	}
	/** Setea los comportamientos que no tiene cierta competencia */
	setComportsToShow(comp: ICompetencia, subModels: ISubModel[]): void {
		const comportsToSet = this.filterNonSelectedComports(comp, subModels);
		this.comportCtl.comportsToShow = comportsToSet;
	}
	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 * @param comp La competencia a la que se quiere añadir el comportamiento
	 * @param niv El nivel que relaciona comport y comp
	 * @param comports El array de comportamientos que añadirán a esa comp con ese nivel
	 * @param model El modelo a modificar
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comports: IComportamiento[], model: IRefModel): void {
		let matchSubModel = model.subModels.find(x => x.competencia?.id === comp.id && x.nivel?.id === niv.id);
		if (!matchSubModel) {
			matchSubModel = {
				nivel: niv,
				competencia: comp,
				comportamientos: [],
			};
			model.subModels.push(matchSubModel);
		}
		//Se busca si el comportamiento ya está añadido al subModelo, de ser asi no se añade
		const comportsToAdd = comports.filter(c => {
			const cFinded = matchSubModel?.comportamientos.find(cToFind => cToFind.id === c.id);
			return !cFinded ? true : false;
		});
		matchSubModel.comportamientos.push(...comportsToAdd);
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel) {
		const _model = this.evModel.value;
		const subModel = this.findSubModel(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}

	addComports(comports: IComportamiento[]) {
		if (!this.comportCtl.compSelected || !this.comportCtl.nivSelected) {
			alert('Contacte con un programador');
			return;
		}
		this.addComportToCompet(
			this.comportCtl.compSelected,
			this.comportCtl.nivSelected,
			comports,
			this.evModel.value,
		);
	}
	async updateModel(model: IRefModel) {
		//Se eliminan los subModelos que no tengan comportamientos
		model.subModels = model.subModels.filter(subM => subM.comportamientos.length !== 0);
		const response = await this.evModelSv.updateRefModel(model.catComp, model);
		console.log(response);
	}
}
