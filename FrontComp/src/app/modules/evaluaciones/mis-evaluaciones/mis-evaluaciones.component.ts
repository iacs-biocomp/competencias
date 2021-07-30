import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { EvaluacionesService } from '../evaluaciones.service';
import { Interval, isWithinInterval, parseISO } from 'date-fns';
import { IEvAllRequiredDTO, ITrabOrgani } from 'sharedInterfaces/DTO';
import { EvIntervals, getIntervalsOfEv } from 'sharedCode/Utility';
import { ICatComp } from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';

/** Enumerador que tiene los 3 estados en los que puede estar una evaluacion */
enum EvStatus {
	/** Representa el momento en el que han de proponerse evaluadores (externos/internos) */
	PROPEVALUADORES,
	/** Representa el momento en el que hay que validar los evaluadores propuestos */
	VALIDACION,
	EVALUAR,
	/** Periodo en el que se muestran los resultados */
	RESULTADOS,
	COMPLETADA,
}

type catCompCtrlView = {
	/** Emits the cCompSelected that is used for the new ev */
	cCompSelectedObs: BehaviorSubject<ICatComp | undefined>;
};

type IEvWithStatus = IEvAllRequiredDTO & { status: EvStatus };
@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.scss'],
})
export class MisEvaluacionesComponent implements OnInit {
	//	catCompEv = this.route.snapshot.paramMap.get(catCompEv)!;
	//	@Input() catCompObs = new BehaviorSubject<ICatComp>();
	public EvStatus = EvStatus;
	evs!: IEvWithStatus[];

	//Pruebas para mostrar un texto u otro en los botones (evaluar o calcular)
	buttonEvaluar = true;
	buttonCalcular = true;

	trabajador!: ITrabOrgani;

	cCompCtl: catCompCtrlView = {
		cCompSelectedObs: new BehaviorSubject<ICatComp | undefined>(undefined),
	};

	constructor(private evService: EvaluacionesService, private jwtSv: JwtService) {}

	async ngOnInit(): Promise<void> {
		const decodedToken = this.jwtSv.getDecodedToken();
		const evs = await this.evService.evaluacionesUsr(decodedToken.username);
		this.evs = evs.map<IEvWithStatus>(ev => {
			return { ...ev, status: this.computeEvStatus(ev) };
		});
		this.buttonEvaluar = true;
		this.buttonCalcular = true;
		this.cCompCtl.cCompSelectedObs.subscribe(cComp => {
			if (!cComp) {
				return;
			}
		});
		// LOG: Inicializado MisEvaluacionesComponent
	}

	/** Set the catComp selected for the new evaluation */
	setCatComp(idCatComp: string): void {
		// TODO: Refactor, usar programación funcional
		for (let i = 0; i <= this.evs.length; i++) {
			if (this.evs[i].catComp.id === idCatComp) {
				this.cCompCtl.cCompSelectedObs.next(this.evs[i].catComp);
			}
		}
	}

	/**
	 * Funcion para igualar la catcompetencial y buscar a los trabajadores con la
	 * misma catcomp que se va a evaluar
	 */
	takeCatComp() {
		// TODO: Refactor, usar programación funcional
		for (let i = 0; i <= this.evs.length; i++) {
			if (this.trabajador.catComp == this.evs[i].catComp) {
				//			console.log(this.trabajador.catComp);
			}
		}
	}

	/**
	 * Funcion que calculará en que periodo se encuetra la evaluacion (los 3 del ENUM);
	 * y mostrará un botón u otro
	 */
	computeEvStatus(ev: IEvAllRequiredDTO): EvStatus {
		// LOG: Computando estado de evaluación ${ev}
		const intervals = getIntervalsOfEv(ev);
		const now = new Date();
		const keys = Object.keys(intervals) as Array<keyof EvIntervals>;
		let actualInterval: Interval | undefined;
		keys.forEach(k => {
			// TODO: Solventar errores al pasar a traves de json los Date,
			// posible solución usar libreria para extender JSON,
			//  aunque añadir un dto con los date a string y parsear con parseISO puede servir
			intervals[k].start = parseISO(intervals[k].start as unknown as string);
			intervals[k].end = parseISO(intervals[k].end as unknown as string);
			if (isWithinInterval(now, intervals[k])) {
				actualInterval = intervals[k];
			}
		});
		//	console.log(actualInterval);
		switch (actualInterval) {
			case intervals.periodoPropuesta:
				return EvStatus.PROPEVALUADORES;
			case intervals.periodoEvaluar:
				return EvStatus.EVALUAR;
			case intervals.periodoValidacion:
				return EvStatus.VALIDACION;
			default:
				return EvStatus.COMPLETADA;
		}
	}
}
