import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { EvaluacionesService } from '../evaluaciones.service';
import { Interval, isWithinInterval } from 'date-fns';
import { IEvAllRequired } from 'sharedInterfaces/DTO';
import { EvIntervals, getIntervalsOfEv } from 'sharedCode/Utility';

/** Enumerador que tiene los 3 estados en los que puede estar una evaluacion */
enum EvStatus {
	// TODO: Tsdoc
	PROPEVALUADORES,
	// TODO: Tsdoc
	VALIDACION,
	// TODO: Tsdoc
	EVALUAR,
	// TODO: Tsdoc
	RESULTADOS,
	// TODO: Tsdoc
	COMPLETADA,
}
type IEvWithStatus = IEvAllRequired & { status: EvStatus };
@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.scss'],
})
export class MisEvaluacionesComponent implements OnInit {
	public EvStatus = EvStatus;
	evs!: IEvWithStatus[];
	//Pruebas para mostrar un texto u otro en los botones (evaluar o calcular)
	buttonEvaluar = true;
	buttonCalcular = true;

	constructor(private evService: EvaluacionesService, private jwtSv: JwtService) {}

	async ngOnInit(): Promise<void> {
		const interval: Interval = { start: new Date(2020, 6, 21), end: new Date(2020, 6, 23) };
		console.log(isWithinInterval(new Date(2020, 6, 22), interval));
		const decodedToken = this.jwtSv.getDecodedToken();
		const evs = await this.evService.evaluacionesUsr(decodedToken.username);
		this.evs = evs.map<IEvWithStatus>(ev => {
			return { ...ev, status: this.computeEvStatus(ev) };
		});
		this.buttonEvaluar = true;
		this.buttonCalcular = true;
	}

	/**
	 * Funcion que calculará en que periodo se encuetra la evaluacion (los 3 del ENUM);
	 * y mostrará un botón u otro
	 */
	computeEvStatus(ev: IEvAllRequired): EvStatus {
		const intervals = getIntervalsOfEv(ev);
		const now = new Date();
		const keys = Object.keys(intervals) as Array<keyof EvIntervals>;
		let actualInterval: Interval | undefined;
		keys.forEach(k => {
			if (isWithinInterval(now, intervals[k])) {
				actualInterval = intervals[k];
			}
		});
		console.log(actualInterval);
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
