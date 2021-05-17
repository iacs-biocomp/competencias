import { Component, Input, OnInit } from '@angular/core';
import { IModelBasicIndxDTO, IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';
import { DbData } from '../new-ev-model.component';

type MiCompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;
type IModelPreDTO = Partial<IModelDTO> & Omit<IModelDTO, 'catComp'>;

type ComportCtrlView = {
	//TODO: Tsdoc
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
};
type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;

/** Este componente esta destinado a la visualización y edición de un modelo, según que parametro se le pase mostrará o no el Añadir/Eliminar comportamiento */
@Component({
	selector: 'app-view-edit-model [dbData] [modoEdicion] [evModel]',
	templateUrl: './view-edit-model.component.html',
	styleUrls: ['./view-edit-model.component.css'],
})
export class ViewEditModelComponent implements OnInit {
	@Input() dbData!: Omit<DbData, 'modelToAdd'>;
	@Input() modoEdicion!: boolean;
	@Input() evModel!: IRefModel;
	/** Modelo que se obtiene cuando el componente se inicia del evModel pasado como input */
	evModelIndx!: IModelBasicIndxDTO;

	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];

	/** Objeto que tiene los datos usados para los select */

	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
	};

	// constructor() {}

	ngOnInit(): void {
		console.log('start on init edit');
		console.log(this.dbData);
		this.competenciasSelect = this.getCompet(this.evModel);
		console.log(this.competenciasSelect);
		this.evModelIndx = this.mapIRefModelToIndexed(this.evModel);
		console.log(this.evModelIndx);
		console.log('end on init edit');
	}

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
	 * @param model El modelo del cual se sacan las competencias
	 * @returns Un array que representa las competencias que tiene el modelo pasado como parametro
	 */
	getCompet(model: IModelPreDTO): ICompetencia[] {
		const competencias = model.subModels.map(x => x.competencia!);
		return competencias.filter((compet, index) => competencias.findIndex(f => compet.id === f.id) === index);
	}

	/**
	 * Concatena los arrays de comportamientos que puedan tener varios submodelos, con la MISMA competencia @see {@link ISubModel}
	 * @param comp La competencia con la que se filtran los subModelos
	 * @param subModels Array de subModelos del cual se devuelven sus comportamientos (concatenados donde comp==subModel.comp)
	 * @returns El array de comportamientos que tiene esa competencia
	 */
	getAllComportsOfComp(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		const subModelos = this.findSubModels(subModels, comp);
		let comports: IComportamiento[] = [];
		subModelos.forEach(s => (comports = comports.concat(s.comportamientos!)));
		return comports;
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel) {
		const _model = this.evModel;
		const subModel = this.findSubModel(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}
	/**
	 * @param subModels El array de submodelos en el que se busca el submodelo
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
	 */
	findSubModel(subModels: ISubModel[], comp: ICompetencia, niv: INivel): ISubModel | undefined {
		const submodelFind = subModels.find(
			subModel => subModel.competencia?.id === comp.id && subModel.nivel?.id === niv.id,
		);
		console.log(submodelFind);
		return submodelFind;
	}
	/**
	 * @param subModels El array de submodelos en el cual se buscaran el/los submodelo/s coincidente/s
	 * @param comp La competencia que se usará como filtrado
	 * @returns El array de subModelos que tienen esa competencia
	 */
	findSubModels(subModels: ISubModel[], comp: ICompetencia): ISubModel[] {
		return subModels.filter(subModel => subModel.competencia?.id === comp.id);
	}

	keysToArrayComport(comportIndxObj: { [key: string]: { descripcion: string } }): { descripcion: string }[] {
		let arrayOfComports: { descripcion: string }[];
		arrayOfComports = Object.keys(comportIndxObj).map(key => comportIndxObj[key]);
		return arrayOfComports;
	}
	//TODO: Completar y pasar a funciones genericas

	keysToArray<T extends Object, T1>(obj: T): T1[] {
		const arr: T1[] = [];
		Object.keys(obj).forEach(key => {
			console.log(obj[key as keyof T]);
		});
		return arr;
	}
}
