import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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
import { IModelBasicIndxDTO, IEvModelGetDTO, ISubModelGetDTO } from 'sharedInterfaces/DTO';
import { ICompetencia, INivel, IComportamiento, ISubModel } from 'sharedInterfaces/Entity';
import { DbData } from 'src/app/types/data';
import { find } from 'lodash';
import { LogService } from 'src/app/shared/log/log.service';

type ControlView = {
	modelToShow: IEvModelGetDTO;
	modelCompetences: ICompetencia[] | undefined;
};

/** Este componente esta destinado a la visualización y edición de un modelo, según que parametro se le pase mostrará o no el Añadir/Eliminar comportamiento */
@Component({
	selector: 'app-view-edit-model [modoEdicion] [evModel] ',
	templateUrl: './view-edit-model.component.html',
	styleUrls: ['./view-edit-model.component.scss'],
})
export class ViewEditModelComponent implements OnInit, OnDestroy {
	comportsToShowObs = new BehaviorSubject<IComportamiento[]>([]);

	/** Indica si el componente ha sido inicializado y se puede renderizar la vista */
	initialized = false;
	dbData!: Omit<DbData, 'modelToAdd'>;
	@Input() modoEdicion!: boolean;
	@Input() evModel!: BehaviorSubject<IEvModelGetDTO>;
	@Output() onSaveChanges = new EventEmitter<IEvModelGetDTO>();
	preSelectedComps: ICompetencia[] = [];

	cv!: ControlView;
	/** Objeto que tiene los datos usados para los select */
	comportCtl = {
		/** Tipo que agrupa una competencia, un nivel y un array de comportamientos */
		compSelected: undefined as ICompetencia | undefined,
		nivSelected: undefined as INivel | undefined,
		comportsToShow: [] as IComportamiento[],
	};
	compsObs!: BehaviorSubject<ICompetencia[]>;

	#subs: Subscription[] = [];

	constructor(
		private readonly cCompSv: CatCompetencialesService,
		private readonly compSv: CompetenciasService,
		private readonly nivSv: NivelService,
		private readonly comportSv: ComportService,
		private readonly evModelSv: EvModelsAdmnService,
		private readonly logger: LogService,
	) {}

	/** Función que se ejecuta cuando se va a construir el componente,
	 * al ser asincrona la vista no debe mostrarse si este metodo no ha acabado*/
	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componte ViewEditModelComponent');
		const [cComps, comps, comports, niveles] = await Promise.all([
			this.cCompSv.getAll(),
			this.compSv.getAll(),
			this.comportSv.getAll(),
			this.nivSv.getAllRefNivs(),
		]);
		this.dbData = {
			cComps: cComps,
			comps: comps,
			comports: comports,
			niveles: niveles,
		};
		this.compsObs = new BehaviorSubject(this.dbData.comps);
		this.#subs.push(
			this.evModel.subscribe(model => {
				// this.evModelIndx = this.mapIRefModelToIndexed(model);
				this.cv = {
					modelToShow: model,
					modelCompetences: this.getCompet(model),
				};
				this.preSelectedComps = getCompetOfModel(model);
			}),
		);
		this.initialized = true;
	}

	ngOnDestroy(): void {
		this.#subs.forEach(s => s.unsubscribe());
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
	mapIRefModelToIndexed(modelToMap: IEvModelGetDTO): IModelBasicIndxDTO {
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
	addComportToCompet(
		comp: ICompetencia,
		niv: INivel,
		comports: IComportamiento[],
		model: IEvModelGetDTO,
	): void {
		let matchSubModel = model.subModels.find(
			subModel => subModel.competencia.id === comp.id && subModel.nivel.id === niv.id,
		);
		this.logger.debug(`Añadiendo comportamientos a comp con ID: ${comp.id} al nivel con ID: ${niv.id}`, {
			listaComportsAAñadir: comports,
		});
		if (!matchSubModel) {
			matchSubModel = {
				id: 0,
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

	updateModel(model: IEvModelGetDTO): void {
		this.onSaveChanges.emit(model);
	}

	/**
	 * Setts the competences to a model, filtering the subModels that have a competence in comps param
	 * @param comps las competencias a pasar
	 */
	editCompets(comps: ICompetencia[]): void {
		console.log(comps);
		const model = { ...this.evModel.value };
		this.cv.modelCompetences = comps;
		model.subModels = model.subModels.filter(subModel => find(comps, { id: subModel.competencia.id }));
		/** Empty subModels, added to model because new comps have been added */
		const newCompsAsSubmodels = comps.reduce<ISubModelGetDTO[]>((acc, comp) => {
			if (!find(model.subModels, { competencia: { id: comp.id } })) {
				acc.push({ id: 0, competencia: comp, comportamientos: [], nivel: this.dbData.niveles[0] });
			}
			return acc;
		}, []);
		model.subModels.push(...newCompsAsSubmodels);
		this.evModel.next(model);
		this.logger.debug(`Editando competencias de un submodelo`, comps);
	}

	/**
	 * Manda todas las competencias que tiene este componente al componente hijo CompSelect
	 */
	updateCompSelectView(): void {
		this.logger.verbose('Mandando las competencias del componente');
		this.compsObs.next(this.dbData.comps);
	}
}
