import { Component } from '@angular/core';
import { IResultadoDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';

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
		const result = this.allResults.find(r => r.competencia === id);
		if (!result) {
			throw new Error('error message, function called with invalid id');
		}
		return result;
	}

	allResults: IResultadoDTO[] = [
		{
			inferiores: 10,
			maxResult: 30,
			minResult: 0,
			pares: 20,
			superiores: 30,
			competencia: 'C1',
		},
		{
			inferiores: 10,
			maxResult: 30,
			minResult: 0,
			pares: 20,
			superiores: 30,
			competencia: 'C2',
		},
		{
			inferiores: 10,
			maxResult: 30,
			minResult: 0,
			pares: 20,
			superiores: 30,
			competencia: 'C3',
		},
	];

	e = [
		{
			name: 'Inferiores',
			value: 10,
		},
		{
			name: 'Pares',
			value: 20,
		},
		{
			name: 'Superiores',
			value: 30,
		},
	];
	// {
	// 	inferiores: 10,
	// 	maxResult: 30,
	// 	minResult: 0,
	// 	pares: 20,
	// 	superiores: 30,
	// 	competencia: 'C1',
	// },

	competences: Pick<ICompetencia, 'id' | 'descripcion'>[] = [
		{ id: 'C1', descripcion: 'Flexibilidad' },
		// { id: 'C2' }, { id: 'C3' }
	];
}
