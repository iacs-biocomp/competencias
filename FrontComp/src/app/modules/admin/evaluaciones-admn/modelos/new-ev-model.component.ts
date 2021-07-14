import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { ComportService } from '../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../niveles-admin/services/nivel.service';
import { EvModelsAdmnService } from '../services/ev-models-admn.service';
import { findSubModels, getAllComportsOfComp, findSubModelByCompNiv } from 'sharedCode/Utility';
import {
	ICatComp,
	ICompetencia,
	IComportamiento,
	IEvModel,
	INivel,
	ISubModel,
} from 'sharedInterfaces/Entity';
import { WithOptional } from 'sharedInterfaces/Utility';
import { DbData } from 'src/app/types/data';

type IModelPreDTO = Partial<IModelDTO> & {
	subModels: WithOptional<ISubModel, 'nivel'>[];
};

export type DbDataEvModel = DbData & {
	/** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	modelToAdd: IModelPreDTO;
};

type CompNivObjet = {
	nivObjetivo?: INivel;
} & ICompetencia;

/** Tipo que sirve para concatena nivel, competencia e IComportamiento */
type ComportNivComp = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;
/**
 * Tipo que agrupa competencias seleccionadas, nivel seleccionado y comportamientos seleccionados
 */
type ControlView = {
	//?? Tal vez un Pick<Competencia>?
	/** La ultima competencia seleccionada */
	compSelected?: ICompetencia;
	/** El nivel que tendra la competencia seleccionada */
	nivSelected?: INivel;
	/** Array con los comportamientos que tendra la evaluacion  */
	comportsSelected: IComportamiento[];
	/** Observable con los comportamientos, si cambia el modelo deben actualizarse y mostrar los correctos */
	comportDescObs: BehaviorSubject<string | undefined>;
	/** Array con los comportamientos filtrados */
	comportsFiltered: IComportamiento[];
	/** Son los comportamientos restantes de la competencia seleccionada (Los que aun no se han añadido) */
	comportsRemainingOfComp: IComportamiento[];
	/** Guarda la lista de competencias seleccionadas */
	competenciasSelect: CompNivObjet[];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: ComportNivComp[];
};
/**
 * Interfaz de validadores generica, cada propiedad del objeto que implemente esta interfaz ha de
 * ser una función que devuelva un boolean o Promise<boolean>
 *
 * `TRUE` Si es valido, `FALSE` si no
 */
interface EvModalValidators {
	[key: string]: (...args: any[]) => boolean | Promise<boolean>;
}

/**
 * Componente dedicado a crear un nuevo modelo usado para las evaluaciones
 */
@Component({
	selector: 'app-new-ev-model',
	templateUrl: './new-ev-model.component.html',
	styleUrls: ['./new-ev-model.component.scss'],
})
export class NewEvModelComponent implements OnInit {
	/** Objeto que tiene los datos usados para los select */
	dbData: DbDataEvModel = {
		cComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
		},
	};

	cv: ControlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
		comportDescObs: new BehaviorSubject<string | undefined>(undefined),
		comportsFiltered: [],
		comportsRemainingOfComp: [],
		competenciasSelect: [],
		comportamientosSelect: [],
	};

	/** Contiene todas las funciones usadas para validar datos en este componente */
	validators: EvModalValidators = {
		nivObjetivoValidator: (comps: CompNivObjet[]) =>
			comps.every(c => {
				if (!c.nivObjetivo) {
					return false;
				}
				return true;
			}),
	};

	/** Posicion actual de la vista (sirve para comprobar si se puede pasar y volver de tab) */
	current = 0;

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
		private evModelSv: EvModelsAdmnService,
	) {}

	findSubModelByCompNiv = findSubModelByCompNiv;
	findSubModels = findSubModels;
	getAllComportsOfComp = getAllComportsOfComp;

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAll(),
			this.nivSv.getAllRefNivs(),
			this.comportSv.getAll(),
		]);
		this.dbData.cComps = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.dbData.comports = promises[3];
		this.cv.comportDescObs.subscribe(txt => {
			if (!txt) {
				this.cv.comportsFiltered = this.dbData.comports;
				return;
			}
			const filterValue = txt.toLowerCase().replace(/\s/g, '');
			this.cv.comportsFiltered = this.cv.comportsRemainingOfComp.filter(comport =>
				comport.descripcion.toLowerCase().replace(/\s/g, '').includes(filterValue),
			);
		});
	}

	/** Selecciona la categoría competentencial que va a tener el modelo
	 *
	 * @param catCompet la categoría competencial elegida
	 */
	selectCatComp(catCompet: ICatComp) {
		this.dbData.modelToAdd.catComp = catCompet;
	}

	/**
	 * Añade o quita del {@link NewEvModelComponent.dbData| modelToAdd} los subModelos con esa competencia
	 *
	 * @param comp La competencia que se usa para buscar los subModelos que la poseen
	 */
	toggleComp(comp: ICompetencia) {
		const _modelToAdd = this.dbData.modelToAdd;
		console.log(this.findSubModels(_modelToAdd.subModels, comp));
		if (this.findSubModels(_modelToAdd.subModels, comp).length === 0) {
			//Se añade la competencia
			_modelToAdd.subModels.push({
				competencia: comp,
				nivel: undefined,
				comportamientos: [],
			});
			this.cv.competenciasSelect.push(comp);
		} else {
			//Se elimina la competencia
			_modelToAdd.subModels = _modelToAdd.subModels.filter(subModel => subModel.competencia !== comp);
			const compIndx = this.cv.competenciasSelect.indexOf(comp);
			this.cv.competenciasSelect.splice(compIndx, 1);
		}
	}

	/** Selecciona los comportamientos que va tener el submodelo
	 *
	 * @param comport comportamiento seleccionado
	 */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.cv.comportsSelected;
		const index = this.cv.comportsSelected.indexOf(comport);
		if (index === -1) {
			arrToPush.push(comport);
		} else {
			arrToPush.splice(index, 1);
		}
	}

	/**
	 * Selecciona el nivel objetivo de cada competencia
	 *
	 * @param nivel nivel objetvio seleccionado
	 * @param compet competencia seleccionada
	 */
	selectNivelObjetivo(nivel: INivel, compet: ICompetencia) {
		const index = this.cv.competenciasSelect.indexOf(compet);
		this.cv.competenciasSelect[index].nivObjetivo = nivel;
	}

	/**
	 * Esta función se llama en la primera vista del modal de crear modelos,
	 * al elegir una categoria competencial la ventana hace scroll automatico
	 * hasta la flecha de siguiente vista *
	 *
	 * @param element el elemento al que scrolleará al hacer click
	 */
	scrollToButton(element: HTMLElement) {
		element.scrollIntoView();
	}

	/**
	 * Comprueba que las vistas del modelo pueden moverse izquierda y derecha si existe otra vista contigua
	 *
	 */
	//TODO: [7]{N2} los numeros no pueden ser estáticos
	move(derecha: boolean) {
		if (derecha && this.current < 3) {
			this.current++;
		}
		if (!derecha && this.current > 0) {
			this.current--;
		}
	}

	/**
	 * Va añadiendo los comportamientos que se seleccionan a cv
	 */
	addAllComports(): void {
		const cSelected = this.cv.compSelected;
		const nivSelected = this.cv.nivSelected;
		if (!cSelected || !nivSelected) {
			return;
		}
		this.cv.comportsSelected.forEach(comport => this.addComportToCompet(cSelected, nivSelected, comport));
	}

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 *
	 * @param comp La competencia a la que se quiere añadir el comportamiento
	 * @param niv El nivel que relaciona comport y comp
	 * @param comport El comportamiento que se añade a esa comp con ese nivel
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comport: IComportamiento): void {
		let matchSubModel = this.dbData.modelToAdd.subModels.find(
			x => x.competencia?.id === comp.id && x.nivel?.id === niv.id,
		);
		if (!matchSubModel) {
			matchSubModel = {
				nivel: niv,
				competencia: comp,
				comportamientos: [],
			};
			this.dbData.modelToAdd.subModels.push(matchSubModel);
		}
		const comportIndx = matchSubModel.comportamientos?.indexOf(comport);
		if (comportIndx === -1) {
			matchSubModel.comportamientos?.push(comport);
		}
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 *
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrarCo1: {
          descripcion: 'dsadsaasd',
        },
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel) {
		const _model = this.dbData.modelToAdd;
		const subModel = this.findSubModelByCompNiv(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}

	/**
	 *
	 * @param comp La competencia de la que se quiere obtener los comportamientos no asociados
	 * @param subModels Array de todos los subModelos
	 * @returns Un array de comportamientos que esa competencia aun no tiene asociados
	 */
	getRemainingComports(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		const comportsOfComp = this.getAllComportsOfComp(comp, subModels);
		console.log(comportsOfComp);
		const comports = this.dbData.comports.filter(
			comport => comportsOfComp.find(c => c.id === comport.id) === undefined,
		);
		console.log(comports);
		return comports;
	}

	/**
	 * Guarda un evModel en el backend, este debería venir validado, si ocurre un error se maneja la excepción
	 *
	 * @param evModel
	 */
	async saveEvModel(evModel: IModelPreDTO) {
		if (!evModel.catComp) {
			return alert('Contacte con un programador');
		}
		evModel.subModels = evModel.subModels.filter(subM => !!subM.nivel);
		let saved: IEvModel | undefined;
		try {
			saved = await this.evModelSv.save(evModel as IModelDTO, true);
		} catch (err) {
			//! LOG
		}
		if (!saved) {
			alert(
				'El modelo de la evaluacion no se ha guardado correctamente, compruebe los campos o contacte con un programador',
			);
		}
	}
}
