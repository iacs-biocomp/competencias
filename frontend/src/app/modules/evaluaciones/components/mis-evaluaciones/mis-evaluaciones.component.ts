import { Component, OnInit } from '@angular/core';
import { isWithinInterval } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { getIntervalsOfEv, EvIntervals } from 'sharedCode/Utility';
import { IEvAllRequiredDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { EvaluacionesService } from 'src/app/services/data';
import { LogService } from 'src/app/shared/log/log.service';

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
	isDataLoaded = false;
	evs: IEvWithStatus[] = [];

	//Pruebas para mostrar un texto u otro en los botones (evaluar o calcular)
	buttonEvaluar = true;
	buttonCalcular = true;

	// trabajador!: ITrabOrgani;

	cCompCtl = {
		/** Emits the cCompSelected that is used for the new ev */
		cCompSelectedObs: new BehaviorSubject<ICatComp | undefined>(undefined),
	};

	constructor(
		private evService: EvaluacionesService,
		private jwtSv: JwtService,
		private readonly logger: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		const decodedToken = this.jwtSv.getDecodedToken();
		if (!decodedToken) {
			throw new Error('JWT is undefined in MisEvaluacionesComponent');
		}
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
		this.isDataLoaded = true;
		this.logger.log('Inicializado MisEvaluacionesComponent');
	}

	/**
	 * Funcion que calculará en que periodo se encuetra la evaluacion (los 3 del ENUM);
	 * y mostrará un botón u otro
	 */
	computeEvStatus(ev: IEvAllRequiredDTO): EvStatus {
		this.logger.log(`Computando estado de evaluación ${ev}`);

		const intervals = getIntervalsOfEv(ev);
		const now = new Date();
		const keys = Object.keys(intervals) as Array<keyof EvIntervals>;
		let actualInterval: Interval | undefined;
		keys.forEach(k => {
			if (isWithinInterval(now, intervals[k])) {
				actualInterval = intervals[k];
			}
		});
		this.logger.log(`actualInterval`);
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
