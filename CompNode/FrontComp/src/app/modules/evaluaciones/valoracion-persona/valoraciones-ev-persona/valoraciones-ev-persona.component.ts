import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICompetencia, IComportamiento, IEvModel, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';
import { getAllComportsOfComp, getCompetOfModel } from 'sharedCode/Utility';

type CompWithComports = ICompetencia & {
	comports: IComportamiento[];
};

type ControlView = {
	// //TODO: Tsdoc
	compsYComports: CompWithComports[];
};

/**
 * TODO: Tsdoc de que hace el componente
 */
@Component({
	selector: 'app-valoraciones-ev-persona [evModelObs] [savedVals] [worker]',
	templateUrl: './valoraciones-ev-persona.component.html',
	styleUrls: ['./valoraciones-ev-persona.component.scss'],
})
export class ValoracionesEvPersonaComponent implements OnInit {
	//TODO: Tsdoc
	@Input() worker!: ITrabajador;
	//TODO: Tsdoc
	@Input() evModelObs!: BehaviorSubject<IEvModel>;
	//TODO: Tsdoc
	@Input() savedVals!: BehaviorSubject<IValoracion[]>;
	//TODO: Tsdoc
	@Output() onValsSetted = new EventEmitter<IValoracion[]>();

	/** True cuando el componente puede renderizarse */
	initialized = false;

	cv!: ControlView;

	getAllComportsOfComp = getAllComportsOfComp;
	getCompetOfModel = getCompetOfModel;

	async ngOnInit(): Promise<void> {
		console.log(this.evModelObs.value);
		console.log(this.savedVals.value);
		/** Subscription to the model that comes from the backend */
		this.evModelObs.subscribe(evModel => {
			const comps = getCompetOfModel(evModel);
			this.cv = {
				compsYComports: comps.map(c => {
					return { comports: getAllComportsOfComp(c, evModel.subModels!), ...c };
				}),
			};
		});
		this.initialized = true;
	}

	//TODO: tsdoc
	radioChecked(comp: ICompetencia, comport: IComportamiento, puntuacion: number): boolean {
		const val = this.changeName(this.savedVals.value, comp, comport);
		if (!val) {
			return false;
		} else {
			return val.valoracion === puntuacion ? true : false;
		}
	}

	/**
	 * Busca en un array si existe cierta valoración con una comp y comport determinado
	 * TODO: Complete
	 * @param vals
	 * @param comp
	 * @param comport
	 * @returns
	 */
	changeName(vals: IValoracion[], comp: ICompetencia, comport: IComportamiento): IValoracion | undefined {
		return vals.find(val => val.comp.id === comp.id && val.comport.id === comport.id);
	}

	/* cuando se le de al boton de guardar (emitir esas valoraciones)
	evaluaciones ya guardadas (tienen que estar en checked) */
}
