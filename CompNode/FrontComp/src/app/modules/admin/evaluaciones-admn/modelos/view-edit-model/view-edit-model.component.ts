import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IModelBasicIndxDTO, IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../../../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../../../competencias-admin/services/competencias.service';
import { ComportService } from '../../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../../niveles-admin/services/nivel.service';
import { DbData } from '../new-ev-model.component';

type MICompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;
type IModelPreDTO = Partial<IModelDTO> & Omit<IModelDTO, 'catComp'>;

type ComportCtrlView = {
	/** Tipo que agrupa una competencia, un nivel y un array de comportamientos */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
};
type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;

//TODO: Cambiar nombre elegir el correcto
type CvChangeMyName = {
	//TODO: Tsdoc
	modelView: IRefModel | undefined;
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

	cv!: CvChangeMyName;
	/** Modelo que se obtiene cuando el componente se inicia del evModel pasado como input */
	evModelIndx!: IModelBasicIndxDTO;
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];

	/** Objeto que tiene los datos usados para los select */
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
	};
	collapseIdObj= {
	}

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
	) {}

	/** Función que se ejecuta cuando se va a construir el componente,
	 * al ser asincrona la vista no debe mostrarse si este metodo no ha acabado*/
	async ngOnInit(): Promise<void> {
		console.log(this.evModel);
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
		this.evModelIndx = this.mapIRefModelToIndexed(this.evModel.value);
		this.cv = {
			modelView: this.evModel.value,
			competenciasModelo: this.getCompet(this.evModel.value),
		};
		this.initialized = true;
		console.log(this.evModelIndx);
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
		const competencias = model.subModels.map(x => x.competencia);
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
		subModelos.forEach(s => (comports = comports.concat(s.comportamientos)));
		return comports;
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
		// TODO: Cache
		return `coll${compId.replace('\u0027', '')}${nivelCode}`;
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
