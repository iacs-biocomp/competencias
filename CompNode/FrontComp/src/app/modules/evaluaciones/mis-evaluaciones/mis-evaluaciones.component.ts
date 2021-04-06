import { Component, OnInit } from '@angular/core';
import { IEvaluacion } from '../../../../../../interfaces/IEvaluaciones';
import { EvaluacionesService } from '../evaluaciones.service';

@Component({
	selector: 'app-mis-evaluaciones',
	templateUrl: './mis-evaluaciones.component.html',
	styleUrls: ['./mis-evaluaciones.component.css'],
})
export class MisEvaluacionesComponent implements OnInit {
	evaluacionData!: IEvaluacion[];

	//Pruebas para mostrar un texto u otro en los botones (evaluar o calcular)
	buttonEvaluar = true;
	buttonCalcular = true;

	constructor(private evService: EvaluacionesService) {}

	async ngOnInit(): Promise<void> {
		this.evaluacionData = await this.evService.evaluacionesUsr('TEST');
		this.buttonEvaluar = true;
		this.buttonCalcular = true;

		console.log(
			this.evaluacionData,
			await this.evService.evaluacionesUsr('TEST')
		);
	}
}
