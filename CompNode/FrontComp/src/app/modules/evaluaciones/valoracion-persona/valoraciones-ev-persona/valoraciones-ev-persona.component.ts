import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
	ICompetencia,
	IComportamiento,
	IEvModel,
	ITrabajador,
	IValoracion,
	ValoracionesNums,
} from 'sharedInterfaces/Entity';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getAllComportsOfComp, getCompetOfModel } from 'sharedCode/Utility';

//TODO: Cambiar nombre
// TODO: tsdoc
export type NotCompletedVal = Pick<IValoracion, 'evaluado' | 'evaluador' | 'comp' | 'comport' | 'valoracion'>;

type CompWithComports = ICompetencia & {
	comports: IComportamiento[];
};

type ControlView = {
	/** Array con competencias y sus comportamientos */
	compsYComports: CompWithComports[];
};

/**
 * Este componente busca en las valoraciones, si algun comportamiento tiene asociada una valoracion, se la asigna; si no, crea y emite
 * la valoracion al componente padre
 */
@Component({
	selector: 'app-valoraciones-ev-persona [evModelObs] [savedVals] [evaluado] [evaluador]',
	templateUrl: './valoraciones-ev-persona.component.html',
	styleUrls: ['./valoraciones-ev-persona.component.scss'],
})
export class ValoracionesEvPersonaComponent implements OnInit, OnDestroy {
	@Input() evaluado!: ITrabajador;
	@Input() evaluador!: ITrabajador;
	/** El modelo con el que un trabajador es evaluado, puede no corresponder al de una evaluación (Para los propuestos) */
	@Input() evModelObs!: BehaviorSubject<IEvModel>;
	/** Valoraciones que ya estaban guardadas en la DB, (Las que el usuario previamente ha guardado de este worker) */
	@Input() savedVals!: BehaviorSubject<IValoracion[]>;
	/** Emite todas las valoraciones sin distinguir si estaban ya guardadas o no (Cuando finaliza el componente) */
	@Output() onValsSetted = new EventEmitter<NotCompletedVal[]>();
	//TODO: Tsdoc
	cv!: ControlView;
	/** Array de todas las suscripciones del componente*/
	subs: Subscription[] = [];

	getAllComportsOfComp = getAllComportsOfComp;
	getCompetOfModel = getCompetOfModel;

	ngOnInit(): void {
		console.log(this.evModelObs.value);
		console.log(this.savedVals.value);
		this.evModelObs.subscribe(evModel => {
			const comps = getCompetOfModel(evModel);
			this.cv = {
				compsYComports: comps.map(c => {
					return { comports: getAllComportsOfComp(c, evModel.subModels!), ...c };
				}),
			};
		});
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	/**
	 *
	 * @param comp
	 * @param comport
	 * @param puntuacion
	 * @returns
	 */
	radioChecked(comp: ICompetencia, comport: IComportamiento, puntuacion: number): boolean {
		const val = this.evalConCompComport(this.savedVals.value, comp, comport);
		if (!val) {
			return false;
		} else {
			return val.valoracion === puntuacion ? true : false;
		}
	}

	/**
	 * Busca en un array si existe cierta valoración con una comp y comport determinado
	 * TODO: Complete
	 * @param vals array de valoraciones
	 * @param comp la competencia a buscar
	 * @param comport el comportamiento a buscar
	 * @returns la valoracion con ese competencia y ese comportamiento
	 */
	evalConCompComport(
		vals: IValoracion[],
		comp: ICompetencia,
		comport: IComportamiento,
	): IValoracion | undefined {
		return vals.find(val => val.comp.id === comp.id && val.comport.id === comport.id);
	}

	/**
	 * Funcion que emite la evaluacion con su valoracion al componente pade
	 */
	async emitValoraciones() {
		const valoracionesAdd: NotCompletedVal[] = [];
		await Promise.all([
			this.cv.compsYComports.map<Promise<void>[]>(comp =>
				comp.comports.map(async comport => {
					/** id del formulario se forma con 'form', el id de la competencia y el id del comportamiento */
					const id = 'form' + comp.id + comport.id;
					//TODO: Refactor, usar reactiveForms o similar
					/** Html form with radiobtn checked value */
					const form = document.getElementById(id) as any;
					const resultadoStr = form?.elements.values.value as string;
					if (resultadoStr !== '') {
						const resultado = Number.parseInt(resultadoStr) as ValoracionesNums;
						const partialVal = this.returnValoracionesFromNumber(resultado, comp, comport);
						valoracionesAdd.push(partialVal);
					}
				}),
			),
		]);
		console.log(valoracionesAdd);
	}

	/**
	 * @param puntuacion La puntuación que se le ha dado a cierto comportamiendo de X competencia
	 * @param comp La competencia que esta siendo valorada
	 * @param comport El comportamiento de una competencia valorado
	 * @returns Un objeto construido a partir de los parametros
	 */
	//TODO: Cambiar nombre
	returnValoracionesFromNumber(
		puntuacion: ValoracionesNums,
		comp: ICompetencia,
		comport: IComportamiento,
	): NotCompletedVal {
		return {
			comp: comp,
			comport: comport,
			evaluado: this.evaluado,
			evaluador: this.evaluador,
			valoracion: puntuacion,
		};
	}
}
