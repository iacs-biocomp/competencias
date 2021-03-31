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

	constructor(private evService: EvaluacionesService) {}

	async ngOnInit(): Promise<void> {
		this.evaluacionData = await this.evService.evaluacionesUsr('TEST');

		console.log(this.evaluacionData, await this.evService.evaluacionesUsr('TEST'));
	}
}
