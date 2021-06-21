import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICompetencia, IComportamiento, IEvModel, ITrabajador, IValoracion } from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';

// type CompsYComports = {
// 	id: string;
// 	descripcion: string;
// 	comports: IComportamiento[];
// };

type ControlView = {
	// //TODO: Tsdoc
	// compsYComports: CompsYComports[] | undefined;
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

	cv: ControlView = {};

	async ngOnInit(): Promise<void> {
		console.log(this.evModelObs);
		console.log(this.savedVals);
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
}
