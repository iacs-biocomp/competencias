import { Component, OnInit } from '@angular/core';
import { IEvaluacion } from '../../../../../../../interfaces/IEvaluaciones';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

@Component({
	selector: 'app-list-ev',
	templateUrl: './list-ev.component.html',
	styleUrls: ['./list-ev.component.css'],
})
export class ListEvComponent implements OnInit {
	evalToAdd: IEvaluacion[] = [{id: 1, description: 'ff', model: undefined, catComp:{id:'GR1', description:'f'}}];

	constructor(private evalService: EvaluacionesAdmService) {}

	async ngOnInit(): Promise<void> {
		await this.updateEvalView();
	}

	async updateEvalView(): Promise<void> {
		// this.evalToAdd = await this.evalService.getAllEval();
	}
}
