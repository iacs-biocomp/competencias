import { Component } from '@angular/core';
import { findCompById } from 'sharedCode/Utility';
import { ICompGetDTO, IResultadoDTOV2 } from 'sharedInterfaces/DTO';
import { CompetenciasService } from '../../admin/competencias-admin/services/competencias.service';
import { ResultsService } from '../services/resultados.service';

// Cambiar nombre si se ocurre uno mejor
type ResultAndComp = {
	comp: ICompGetDTO;
	maxResult: number;
	minResult: number;
	values: Resultado[];
};

export type Resultado = {
	name: string;
	value: number;
};

@Component({
	selector: 'app-mis-resultados',
	templateUrl: './mis-resultados.component.html',
	styleUrls: ['./mis-resultados.component.scss'],
})
export class MisResultadosComponent {
	constructor(private readonly compSv: CompetenciasService, private readonly resultsSv: ResultsService) {}
	/** Used for not display data that has not been fetched from the server*/
	isDataLoaded = false;
	/** Where data fetched and **not changed**, from the server is stored */
	#dbData = {
		results: [] as IResultadoDTOV2[],
		comps: [] as ICompGetDTO[],
	};
	/** Control view, have the data and variables that belong to the view (html) */
	cv = {
		results: [] as ResultAndComp[],
	};

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

	async ngOnInit(): Promise<void> {
		[this.#dbData.comps, this.#dbData.results] = await Promise.all([
			this.compSv.getAll(),
			this.resultsSv.getFromEvAndWorker(51, '32112D'),
		]);
		this.cv.results = this.mapResultsDtoToIterable(this.#dbData.results);
		console.log(this.cv.results);
		this.isDataLoaded = true;
	}

	mapResultsDtoToIterable(results: IResultadoDTOV2[]): ResultAndComp[] {
		// no-null assertion because results will never reference a comp that isn't in comps array.
		const getCompFn = (compId: string) => findCompById(this.#dbData.comps, compId)!;
		return results.map<ResultAndComp>(result => {
			return {
				comp: getCompFn(result.competencia),
				maxResult: result.maxResult,
				minResult: result.minResult,
				values: result.values,
			};
		});
	}
}
