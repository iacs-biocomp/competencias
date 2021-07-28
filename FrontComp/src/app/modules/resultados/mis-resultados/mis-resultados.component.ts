import { Component, OnInit } from '@angular/core';
import { IResultadoDTO } from 'sharedInterfaces/DTO';

/** Ancho alto */
type ChartView = [number, number];

@Component({
	selector: 'app-mis-resultados',
	templateUrl: './mis-resultados.component.html',
	styleUrls: ['./mis-resultados.component.scss'],
})
export class MisResultadosComponent implements OnInit {
	// Ejemplo para visualizacion de datos usando libreria d3: https://blog.logrocket.com/data-visualization-angular-d3/
	resulEj: IResultadoDTO = {
		inferiores: 10,
		maxResult: 30,
		minResult: 0,
		pares: 20,
		superiores: 30,
	};

	view: ChartView = [700, 400];
	showXAxis = true;
	showYAxis = true;
	gradient = false;
	showLegend = true;
	showXAxisLabel = true;
	xAxisLabel = 'Country';
	showYAxisLabel = true;
	yAxisLabel = 'Population';
	single!: any[];

	colorScheme = {
		domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
	};
	//data1: obj1[] = [];
	domainNames: string[] = [];

	constructor() {
		Object.assign(this, { single: this.single });
	}

	ngOnInit(): void {}
}
