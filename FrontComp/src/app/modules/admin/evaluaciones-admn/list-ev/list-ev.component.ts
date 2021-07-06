import { Component, OnInit } from '@angular/core';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

@Component({
	selector: 'app-list-ev',
	templateUrl: './list-ev.component.html',
	styleUrls: ['./list-ev.component.scss'],
})
export class ListEvComponent implements OnInit {
	/** Controla si se muestra o no el componente NuevoModelo */
	public loadMForm = false;

	/** Lista de las evaluaciones que hay en la bbdd */
	evaluaciones: IEvaluacion[] = [];

	constructor(private evSv: EvaluacionesAdmService) {}

	async ngOnInit(): Promise<void> {
		await this.updateEvalView();
	}

	async updateEvalView(): Promise<void> {
		this.evaluaciones = await this.evSv.getAll();
	}

	/**
	 * Gets all the created evaluations
	 */
	async newEvSaved(updateEvalView: ListEvComponent['updateEvalView']) {
		await updateEvalView();
	}
}
