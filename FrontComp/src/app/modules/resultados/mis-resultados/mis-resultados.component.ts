import { Component } from '@angular/core';
import { findCompById } from 'sharedCode/Utility';
import { ICompGetDTO, IResultadoDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { EV_RESULTS_SAMPLE, resultExample } from './data';
import { CompetenciasService } from '../../admin/competencias-admin/services/competencias.service';
import { ResultadosService } from '../services/resultados.service';

/** Ancho alto */
type ChartView = [number, number];

@Component({
	selector: 'app-mis-resultados',
	templateUrl: './mis-resultados.component.html',
	styleUrls: ['./mis-resultados.component.scss'],
})
export class MisResultadosComponent {
	constructor(private compService: CompetenciasService, private resultService: ResultadosService) {
		Object.assign(this, { single: this.single });
	}

	async ngOnInit(): Promise<void> {
		console.log(this.mapChangeName(this.allResults));
		this.allResults = EV_RESULTS_SAMPLE;
		this.competences = await this.compService.getAll();
		//	this.allResults = await this.resultService.getAll();
	}

	competences: ICompGetDTO[] = [];
	allResults: IResultadoDTO[] = [];

	showXAxis = true;
	showYAxis = true;
	gradient = false;
	showLegend = true;
	showXAxisLabel = true;
	xAxisLabel = 'Evaluadores';
	showYAxisLabel = true;
	yAxisLabel = 'Puntuación';
	single: any[] = [{ inferiores: 10 }];

	colorScheme = {
		domain: ['#C7B42C ', '#A10A28', '#5AA454', '#AAAAAA'],
	};
	domainNames: string[] = [];

	resultExample = resultExample;

	/**
	 * @returns el id y la descripcion de la competencia a la que pertencen los resultados
	 */
	getCompetencesOfResults(allResults: IResultadoDTO[]): ICompGetDTO[] {
		return allResults.map(result => findCompById(this.competences, result.competencia)!);
	}

	/**
	 * Devuelve todos los resultados que pertenecen a una evaluacion
	 * con ese id de competencia
	 * @param id el id de la competencia a buscar
	 * @throws error si no existe ese id
	 * @returns si existe el id, devuelve los resultados
	 */
	getResultsOfCompetence(id: ICompetencia['id']): IResultadoDTO {
		const result = this.allResults.find(r => r.competencia === id);
		if (!result) {
			throw new Error('error message, function called with invalid id');
		}
		return result;
	}

	mapChangeName(allResults: IResultadoDTO[]): void {
		const mapResults = allResults.map(r => {
			return [
				{
					name: 'Inferiores',
					value: r.inferiores,
				},
				{
					name: 'Superiores',
					value: r.superiores,
				},
				{
					name: 'Pares',
					value: r.pares,
				},
			];
		});
		console.log('Resultados', mapResults);
	}
}
