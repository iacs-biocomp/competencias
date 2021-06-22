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
		/** Subscription to the model that comes from the backend */
		this.evModelObs.subscribe(evModel => {
			if(!evModel){
				return;
			}
		})
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

	/* un trabajador, un modelo (observable), hacerlo con el subscribe (me suscribo al modelo que me viene)
	/** Finds the model that belongs to the worker */
	findModelWorker(idCatComp: string): void{
	const x = this.worker.periodos?.find(cCo => cCo.catComp.id === ev.catComp?.id);
	this.evModelObs.next(this.worker.periodos?.find(cC => cC.catComp.id === idCatComp));

	//this.evModelObs.next();
	}
/*
	cuando se le de al boton de guardar (emitir esas valoraciones)

	evaluaciones ya guardadas (tienen que estar en checked) */
}
