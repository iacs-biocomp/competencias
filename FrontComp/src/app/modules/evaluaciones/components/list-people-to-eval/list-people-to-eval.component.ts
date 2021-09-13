import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionesService } from 'services/data';
import { ITrabajadorDTO } from 'sharedInterfaces/DTO';
import { JwtService } from 'src/app/services/auth/jwt.service';

// TODO: Refactor mover a otro sitio
/** Como se llama el parametro que identifica la evaluación a evaluar */
export const evId = 'evId';

/**
 * Muestra la lista de trabajador a los que hay que evaluar en un determinado periodo
 */
@Component({
	selector: 'app-list-people-to-eval',
	templateUrl: './list-people-to-eval.component.html',
	styleUrls: ['./list-people-to-eval.component.scss'],
})
export class ListPeopleToEvalComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;
	workersEvaluated!: ITrabajadorDTO[];
	isDataLoaded = false;

	constructor(
		private route: ActivatedRoute,
		private readonly evSv: EvaluacionesService,
		private readonly jwtSv: JwtService,
	) {}

	async ngOnInit(): Promise<void> {
		this.workersEvaluated = await this.evSv.getEvaluatedOfUser(
			this.jwtSv.getDecodedToken().username,
			Number.parseInt(this.evId),
		);
		this.isDataLoaded = true;
	}
}
