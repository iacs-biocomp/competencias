import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
	ICompetencia,
	IComportamiento,
	IEvaluacion,
	INivel,
	ITrabajador,
	IValoracion,
	ValoracionesNums,
} from 'sharedInterfaces/Entity';
import { BehaviorSubject, Subscription } from 'rxjs';
import { findSubModels, getAllComportsOfComp, getCompetOfModel } from 'sharedCode/Utility';
import { IEvModelGetDTO, IValoracionSettedDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

type ModelIndexed = ICompetencia & {
	nivs: (INivel & { comports: IComportamiento[] })[];
};

type ControlView = {
	/** Array con competencias y sus comportamientos */
	modelIter: ModelIndexed[];
};

export type ValOpId = Omit<IValoracionSettedDTO, 'id'> & { id?: IValoracion['id'] };

/**
 * Este componente busca en las valoraciones, si algun comportamiento tiene asociada una valoracion, se la asigna; si no, crea y emite
 * la valoracion al componente padre
 */
@Component({
	selector: 'app-valoraciones-ev-persona [evModelObs] [savedVals] [evaluado] [evaluador] [evId]',
	templateUrl: './valoraciones-ev-persona.component.html',
	styleUrls: ['./valoraciones-ev-persona.component.scss'],
})
export class ValoracionesEvPersonaComponent implements OnInit, OnDestroy {
	constructor(private readonly logger: LogService) {}

	@Input() evaluado!: ITrabajador;
	@Input() evaluador!: ITrabajador;
	/** El modelo con el que un trabajador es evaluado, puede no corresponder al de una evaluación (Para los propuestos) */
	@Input() evModelObs!: BehaviorSubject<IEvModelGetDTO>;
	/** Valoraciones que ya estaban guardadas en la DB, (Las que el usuario previamente ha guardado de este worker) */
	@Input() savedVals!: BehaviorSubject<IValoracionSettedDTO[]>;
	/** Identifier of ev that is evaluated in the component */
	@Input() evId!: IEvaluacion['id'];
	/** Valorattion emitter, emits all vals, created and updated */
	@Output('onValsSetted') valsEmitter = new EventEmitter<ValOpId[]>();
	/** Control view for html view, all view's variables inside */
	cv!: ControlView;
	/** Array with all subscriptions of the component, used to avoid memory leaks */
	#subs: Subscription[] = [];

	formCoder = {
		encode(comp: ICompetencia, nivel: INivel, comport: IComportamiento): string {
			// I use XX because '-' is reserved in comport, also . and _
			return `formXX${comp}XX${nivel}XX${comport}`;
		},
		decode(formId: string): { comp: string; nivel: string; comport: string } {
			const parts = formId.split('XX');
			return { comp: parts[1], nivel: parts[2], comport: parts[3] };
		},
	};

	getAllComportsOfComp = getAllComportsOfComp;
	getCompetOfModel = getCompetOfModel;

	ngOnInit(): void {
		this.logger.log(`Inicializando ValoracionesEvPersonaComponent`);
		console.log(this.evModelObs.value);
		console.log(this.savedVals.value);

		this.#subs.push(
			this.evModelObs.subscribe(evModel => {
				const comps = getCompetOfModel(evModel);
				this.cv = {
					modelIter: comps.map(comp => {
						const subModelsOfComp = findSubModels(evModel.subModels, comp);
						const comportsOfComp = getAllComportsOfComp(comp, subModelsOfComp) as IComportamiento[];
						let nivsOfComp: (INivel & { comports: IComportamiento[] })[] = [];
						subModelsOfComp.forEach(subModel => {
							if (!nivsOfComp.find(niv => niv.id === subModel.nivel.id)) {
								nivsOfComp.push({ ...subModel.nivel, comports: comportsOfComp });
							}
						});
						return { nivs: subModelsOfComp, ...comp };
					}) as unknown as ModelIndexed[],
				};
			}),
		);
		this.logger.log(`ValoracionesEvPersonaComponent inicializado`);
	}

	ngOnDestroy(): void {
		this.logger.log(`destruyendo ValoracionesEvPersonaComponent`);
		this.#subs.forEach(sub => sub.unsubscribe());
	}

	radioChecked(comp: ICompetencia, comport: IComportamiento, niv: INivel, puntuacion: number): boolean {
		const val = this.evalConCompComport(this.savedVals.value, comp, comport, niv);
		if (!val) {
			return false;
		} else {
			return val.valoracion === puntuacion ? true : false;
		}
	}

	/**
	 * Busca en un array de valoraciones si existe la valoración con una competencia y comportamiento determinado, si existe, la retorna
	 * @param vals array de valoraciones
	 * @param comp la competencia a buscar
	 * @param comport el comportamiento a buscar
	 * @returns la valoracion encontrada con esa competencia y ese comportamiento
	 */
	evalConCompComport(
		vals: IValoracionSettedDTO[],
		comp: ICompetencia,
		comport: IComportamiento,
		niv: INivel,
	): IValoracionSettedDTO | undefined {
		const [compId, comportId, nivId] = [comp.id, comport.id, niv.id];
		this.logger.log(`Buscando valoracion con compId: ${compId} y comportId: ${comportId}`);
		return vals.find(val => val.comp === compId && val.comport === comportId && val.nivel === nivId);
	}

	/**
	 * Funcion asincrona que crea un array con las valoraciones que se enviaran al componente padre,
	 * busca por el id del formulario y recoge las valoraciones de los comportamientos,
	 * construye el objeto IValoracion para enviarlo, lo pushea al array y lo emite al padre
	 */
	async emitValoraciones(): Promise<void> {
		const valsToEmit: ValOpId[] = [];
		this.cv.modelIter.forEach(comp =>
			comp.nivs.forEach(lvl =>
				lvl.comports.forEach(comport => {
					/** id del formulario se forma con 'form', el id de la competencia y el id del comportamiento */
					const id = 'form' + comp.id + comport.id;
					//TODO: [3]{N2} Refactor, usar reactiveForms o similar
					/** Html form with radiobtn checked value */
					const form = document.getElementById(id) as any;
					const resultadoStr = form?.elements.values.value as string;
					if (resultadoStr !== '') {
						const resultado = Number.parseInt(resultadoStr) as ValoracionesNums;
						const partialVal = this.returnValoracionesFromNumber(resultado, comp, comport, lvl);
						valsToEmit.push(partialVal);
					}
				}),
			),
		);
		this.valsEmitter.emit(valsToEmit);
	}

	/**
	 * @param puntuacion La puntuación que se le ha dado a cierto comportamiendo de X competencia
	 * @param comp La competencia que esta siendo valorada
	 * @param comport El comportamiento de una competencia valorado
	 * @returns Un objeto construido a partir de los parametros
	 */
	returnValoracionesFromNumber(
		puntuacion: ValoracionesNums,
		comp: ICompetencia,
		comport: IComportamiento,
		nivel: INivel,
	): ValOpId {
		return {
			comp: comp.id,
			comport: comport.id,
			evaluado: this.evaluado.dni,
			evaluador: this.evaluador.dni,
			valoracion: puntuacion,
			nivel: nivel.id,
			ev: this.evId,
		};
	}
}
