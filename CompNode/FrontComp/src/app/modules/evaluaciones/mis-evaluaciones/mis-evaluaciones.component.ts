import { Component, OnInit } from '@angular/core';
import { IEvaluacion } from '../../../../../../interfaces/IEvaluaciones';

@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.css'],
})
export class MisEvaluacionesComponent implements OnInit {

	evaluacionData!: IEvaluacion;

	constructor() {}

	ngOnInit() {}
}
