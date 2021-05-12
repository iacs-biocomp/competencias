import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvaluacion } from 'sharedInterfaces/Entity/IEvaluaciones';
import { EvaluacionesService } from '../evaluaciones.service';
export const evId = 'evId';

@Component({
	selector: 'app-evaluar-ev',
	templateUrl: './evaluar-ev.component.html',
	styleUrls: ['./evaluar-ev.component.css'],
})
export class EvaluarEvConcretaComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;
	constructor(private route: ActivatedRoute, private evSv: EvaluacionesService) {}

	evaluacion: IEvaluacion = {
		id: 'id',
		description: 'f',
		model: undefined,
	};

	ngOnInit(): void {
		if (evId) console.log(this.evId);
	}
}
