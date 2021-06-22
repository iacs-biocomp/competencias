import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	ICompetencia,
	IComportamiento,
	IEvaluacion,
	IEvModel,
	ITrabajador,
	IValoracion,
	ValoracionesNums,
} from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';
import { getAllComportsOfComp, getCompetOfModel } from 'sharedCode/Utility';
import { JwtService } from 'src/app/services/jwt.service';
import { UserDataService } from 'src/app/modules/usuario/datos/user-data.service';

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
	selector: 'app-valoraciones-ev-persona [evModelObs] [savedVals] [worker]',
	templateUrl: './valoraciones-ev-persona.component.html',
	styleUrls: ['./valoraciones-ev-persona.component.scss'],
})
export class ValoracionesEvPersonaComponent implements OnInit {
	/** El trabajador a evaluar de tipo ITrabajador */
	@Input() worker!: ITrabajador;
	/** Un observable de IEvModel */
	@Input() evModelObs!: BehaviorSubject<IEvModel>;
	/** Evaluaciones almacenadas */
	@Input() savedVals!: BehaviorSubject<IValoracion[]>;
	/** Evaluaciones a emitir */
	@Output() onValsSetted = new EventEmitter<IValoracion[]>();

	/** True cuando el componente puede renderizarse */
	initialized = false;

	cv!: ControlView;

	constructor(private jwtSv: JwtService, private usrSv: UserDataService) {}

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

	/**
	 * Si es comportamientos ya tenia una valoracion, la asigna
	 */
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
	 * @param vals array de valoraciones
	 * @param comp la competencia a buscar
	 * @param comport el comportamiento a buscar
	 * @returns la valoracion con ese competencia y ese comportamiento
	 */
	changeName(vals: IValoracion[], comp: ICompetencia, comport: IComportamiento): IValoracion | undefined {
		return vals.find(val => val.comp.id === comp.id && val.comport.id === comport.id);
	}

	/**
	 * Funcion que emite la evaluacion con su valoracion al componente pade
	 */
	async emitValoraciones() {
		const valoracionesAdd: IValoracion[] = [];
		// se recoge el token para definir el evaluador
		const workerTkn = this.jwtSv.getDecodedToken();
		const usrInfo = await this.usrSv.getUserData(workerTkn.username);

		this.cv.compsYComports.forEach(comp =>
			comp.comports.forEach(comport => {
				/** id del formulario se forma con 'form', el id de la competencia y el id del comportamiento */
				const id = 'form' + comp.id + comport.id;
				const form = document.getElementById(id) as any;
				const resultadoStr = form?.elements.values.value as string;
				/** Si resultados vale algo, se crea la valoracion */
				if (resultadoStr !== '') {
					/** Indica que valor de 1 a 5 tiene el comportamiento */
					const resultado = Number.parseInt(resultadoStr);
					const val: IValoracion = {
						id: 1,
						comp: comp,
						comport: comport,
						ev: undefined as unknown as IEvaluacion,
						evaluado: this.worker,
						evaluador: usrInfo.trabajador!,
						valoracion: resultado as ValoracionesNums,
					};
					valoracionesAdd.push(val);
				}
			}),
		);
		console.log(valoracionesAdd);
		//this.onValsSetted.emit(valoracionesAdd);
	}
}
