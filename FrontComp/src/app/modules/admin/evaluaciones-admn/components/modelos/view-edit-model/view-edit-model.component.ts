import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
	CatCompetencialesService,
	CompetenciasService,
	NivelService,
	ComportService,
	EvModelsAdmnService,
} from 'services/data';
import {
	getCompetOfModel,
	findSubModels,
	findSubModel,
	filterNonSelectedComports,
	getAllComportsOfComp,
} from 'sharedCode/Utility';
import { IRefModel, IModelBasicIndxDTO } from 'sharedInterfaces/DTO';
import { ICompetencia, INivel, IComportamiento, ISubModel } from 'sharedInterfaces/Entity';
import { DbData } from 'src/app/types/data';
import { LogService } from 'src/app/shared/log/log.service';

type ComportCtrlView = {
	/** Tipo que agrupa una competencia, un nivel y un array de comportamientos */
	compSelected: ICompetencia | undefined;
	nivSelected: INivel | undefined;
	comportsToShow: IComportamiento[];
};

type ControlView = {
	modelToShow: IRefModel;
	modelCompetences: ICompetencia[] | undefined;
};

/** Este componente esta destinado a la visualización y edición de un modelo, según que parametro se le pase mostrará o no el Añadir/Eliminar comportamiento */
@Component({
	selector: 'app-view-edit-model [modoEdicion] [evModel]',
	templateUrl: './view-edit-model.component.html',
	styleUrls: ['./view-edit-model.component.scss'],
})
export class ViewEditModelComponent implements OnInit {
	comportsToShowObs = new BehaviorSubject<IComportamiento[]>([]);

	/** Indica si el componente ha sido inicializado y se puede renderizar la vista */
	initialized = false;
	dbData!: Omit<DbData, 'modelToAdd'>;
	@Input() modoEdicion!: boolean;
	@Input() evModel!: BehaviorSubject<IRefModel>;
	preSelectedComps: ICompetencia[] = [];

	cv!: ControlView;
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
		private readonly logger: LogService,
	) {}

	/** Función que se ejecuta cuando se va a construir el componente,
	 * al ser asincrona la vista no debe mostrarse si este metodo no ha acabado*/
	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componte view-edit-model');
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAll(),
			this.comportSv.getAll(),
			this.nivSv.getAllRefNivs(),
		]);
		this.dbData = {
			cComps: promises[0],
			comps: promises[1],
			comports: promises[2],
			niveles: promises[3],
		};
		this.compsObs = new BehaviorSubject(this.dbData.comps);
		this.subs.push(
			this.evModel.subscribe(model => {
				this.evModelIndx = this.mapIRefModelToIndexed(model);
				this.cv = {
					modelToShow: model,
					modelCompetences: this.getCompet(model),
				};
				this.preSelectedComps = getCompetOfModel(model);
			}),
		);
		this.initialized = true;
	}

	//Se redeclaran para que la vista pueda acceder a ellas
	findSubModels = findSubModels;
	findSubModel = findSubModel;
	filterNonSelectedComports = filterNonSelectedComports;
	getAllComportsOfComp = getAllComportsOfComp;
	getCompet = getCompetOfModel;

	/**
	 * Mapea un modelo de tipo IRefModel a IModelBasicIndxDTO
	 *
	 * @param modelToMap Modelo de tipo IRefModel (Con subModelos) que se quiere mapear
	 * @returns El modelo mapeado
	 */
	mapIRefModelToIndexed(modelToMap: IRefModel): IModelBasicIndxDTO {
		const model: Partial<IModelBasicIndxDTO> = {};
		model.id = modelToMap.id;
		model.catComp = modelToMap.catComp;
		model.comps = {};
		/** Array de competencias del modelo */
		const competencias: ICompetencia[] = this.getCompet(modelToMap);
		competencias.forEach(c => {
			const comportsOfC = this.getAllComportsOfComp<IComportamiento, ISubModel>(c, modelToMap.subModels);
			model.comps![c.id] = { descripcion: c.descripcion, comports: {} };
			comportsOfC.forEach(comport => {
				model.comps![c.id].comports[comport.id] = { descripcion: comport.descripcion };
			});
		});
		return model as IModelBasicIndxDTO;
	}

	/**Devuelve un string el cual es identificador de un elemento html que tiene la clase collapsable */
	collapseId(compId: string, nivelCode: string) {
		return `coll${compId.replace('\u0027', '')}${nivelCode}`;
	}

	/** Setea los comportamientos que no tiene cierta competencia */
	setComportsToShow(comp: ICompetencia, subModels: ISubModel[]): void {
		const comportsToSet = this.filterNonSelectedComports(this.dbData.comports, comp, subModels);
		// this.comportCtl.comportsToShow = comportsToSet;
		this.comportsToShowObs.next(comportsToSet);
	}

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 *
	 * @param comp La competencia a la que se quiere añadir el comportamiento
	 * @param niv El nivel que relaciona comport y comp
	 * @param comports El array de comportamientos que añadirán a esa comp con ese nivel
	 * @param model El modelo a modificar
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comports: IComportamiento[], model: IRefModel): void {
		let matchSubModel = model.subModels.find(x => x.competencia?.id === comp.id && x.nivel?.id === niv.id);
		this.logger.debug(`Añadiendo comportamientos a comp con ID: ${comp.id} al nivel con ID: ${niv.id}`, {
			listaComportsAAñadir: comports,
		});
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
		this.logger.verbose('Pusheando comportamientos');
		matchSubModel.comportamientos.push(...comportsToAdd);
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 *
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel): void {
		this.logger.debug(
			`Eliminando un comportamiento con ID: ${comport.id}, de la comp con ID: ${comp.id} y el nivel con ID: ${niv.id}`,
			comport,
		);
		const _model = this.evModel.value;
		const subModel = this.findSubModel(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}

	/**
	 * Añade comportamientos a la Competencia & Nivel seleccionados (SubModelos)
	 *
	 * @param comports Los comportamientos a añadir
	 */
	addComports(comports: IComportamiento[]): void {
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

	async updateModel(model: IRefModel): Promise<void> {
		this.logger.verbose('Actualizando modelo');
		//Se eliminan los subModelos que no tengan comportamientos
		model.subModels = model.subModels.filter(subM => subM.comportamientos.length !== 0);
		const response = await this.evModelSv.updateRefModel(model);
		if (response) {
			alert('Se ha guardado correctamente');
		} else {
			alert('Ha habido un error contacte con un programador');
		}
	}

	/**
	 * Edita el array de competencias de un submodelo
	 *
	 * @param comps las competencias a pasar
	 */
	editCompets(comps: ICompetencia[]): void {
		const model = { ...this.evModel.value };
		const compsIds = comps.map(c => c.id);
		model.subModels = model.subModels.filter(s => compsIds.includes(s.competencia.id));
		this.logger.debug(`Editando competencias de un submodelo`, comps);
		// TODO: [5]{N2} Añadir submodelo vacio con las nuevas competencias, para ello modificar la interfaz ISubModel, arreglar tipos
		this.cv.modelCompetences = comps;
	}

	/**
	 * Manda todas las competencias que tiene este componente al componente hijo CompSelect
	 */
	updateCompSelectView(): void {
		this.logger.verbose('Mandando las competencias del componente');
		this.compsObs.next(this.dbData.comps);
	}
}
