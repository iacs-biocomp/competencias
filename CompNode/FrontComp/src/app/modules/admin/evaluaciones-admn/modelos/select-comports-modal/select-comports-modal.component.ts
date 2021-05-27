import { Component, OnInit } from '@angular/core';
import {
	ICompetencia,
	IComportamiento,
	INivel,
	IEvModel,
	ICatComp,
	ISubModel,
} from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';
import { IModelDTO } from 'sharedInterfaces/DTO';
import { WithOptional } from 'sharedInterfaces/Utility';

type IModelPreDTO = Partial<IModelDTO> & {
	subModels: WithOptional<ISubModel, 'nivel'>[];
};
type ComportCtrlView = {
	/** La ultima competencia seleccionada */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
	comportDescObs: BehaviorSubject<string | undefined>;
	comportsFiltered: IComportamiento[];
	/** Son los comportamientos restantes de la competencia seleccionada (Los que aun no se han añadido) */
	comportsRemainingOfComp: IComportamiento[];
};
export type DbData = {
	/** listado de categorias competenciales */
	catComps: ICatComp[];
	/** listado de competencias */
	comps: ICompetencia[];
	/** listado de comportamientos */
	comports: IComportamiento[];
	/** listado de niveles */
	niveles: INivel[];
	/** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	modelToAdd: IModelPreDTO;
};

@Component({
	selector: 'app-select-comports-modal',
	templateUrl: './select-comports-modal.component.html',
	styleUrls: ['./select-comports-modal.component.scss'],
})
export class SelectComportsModalComponent implements OnInit {
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
		comportDescObs: new BehaviorSubject<string | undefined>(undefined),
		comportsFiltered: [],
		comportsRemainingOfComp: [],
	};
	/** Objeto que tiene los datos usados para los select */
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
		},
	};
	constructor() {}

	ngOnInit(): void {}

	/** Selecciona los comportamientos que va tener el submodelo
	 *
	 * @param comport comportamiento seleccionado
	 */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected.indexOf(comport);
		if (index == -1) {
			arrToPush.push(comport);
		} else {
			arrToPush.splice(index, 1);
		}
	}
	/**Flush the "buffer" and moves the data into the model of type {@link IEvModel}*/
	addAllComports(): void {
		this.comportCtl.comportsSelected.forEach(comport =>
			this.addComportToCompet(this.comportCtl.compSelected!, this.comportCtl.nivSelected!, comport),
		);
	}
	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
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
}
