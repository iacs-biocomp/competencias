import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { evId } from '../evaluaciones.module';
import { EvaluacionesService } from '../evaluaciones.service';

@Component({
	selector: 'app-evaluar-ev',
	templateUrl: './evaluar-ev.component.html',
	styleUrls: ['./evaluar-ev.component.css'],
})
export class EvaluarEvConcretaComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;
	constructor(private route: ActivatedRoute, private evSv: EvaluacionesService) {}

	ngOnInit(): void {
		if (evId) console.log(this.evId);

	}
}
