import { Component, OnInit } from '@angular/core';
import { IEvaluacion } from 'sharedInterfaces/Entity/IEvaluaciones';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

@Component({
	selector: 'app-list-ev',
	templateUrl: './list-ev.component.html',
	styleUrls: ['./list-ev.component.css'],
})
export class ListEvComponent implements OnInit {
	/** Controla si se muestra o no el componente NuevoModelo */
	public loadMForm = false;

	/** Lista de las evaluaciones que hay en la bbdd */
	evaluaciones: IEvaluacion[] = [];

	constructor(private evalService: EvaluacionesAdmService) {}

	async ngOnInit(): Promise<void> {
		await this.updateEvalView();
	}

	async updateEvalView(): Promise<void> {
		this.evaluaciones = await this.evalService.getAll();
	}
}
