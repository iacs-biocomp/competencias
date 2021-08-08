import { Component } from '@angular/core';
import { IResultadoDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { EV_RESULTS_SAMPLE } from './data';

/** Ancho alto */
type ChartView = [number, number];

@Component({
	selector: 'app-mis-resultados',
	templateUrl: './mis-resultados.component.html',
	styleUrls: ['./mis-resultados.component.scss'],
})
export class MisResultadosComponent {
	constructor() {
		Object.assign(this, { single: this.single });
	}

	showXAxis = true;
	showYAxis = true;
	gradient = false;
	showLegend = true;
	showXAxisLabel = true;
	xAxisLabel = 'Evaluadores';
	showYAxisLabel = true;
	yAxisLabel = 'Puntuacion';
	single: any[] = [{ inferiores: 10 }];

	colorScheme = {
		domain: ['#C7B42C ', '#A10A28', '#5AA454', '#AAAAAA'],
	};
	domainNames: string[] = [];

	//TODO: Tsdoc
	getResultsOfCompetence(id: ICompetencia['id']): IResultadoDTO {
		const result = EV_RESULTS_SAMPLE.find(r => r.competencia === id);
		if (!result) {
			throw new Error('error message, function called with invalid id');
		}
		return result;
	}

	competences: Pick<ICompetencia, 'id' | 'descripcion'>[] = [
		{ id: 'C1', descripcion: 'Flexibilidad' },
		// { id: 'C2' }, { id: 'C3' }
	];
}
