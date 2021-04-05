import { Component, OnInit } from '@angular/core';
import { ICompetencia } from '../../../../../../../interfaces/IEvaluaciones';
import { CompetenciasService } from '../services/competencias.service';

@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.css'],
})
export class TableCompetenciasComponent implements OnInit {
	competencias: ICompetencia[] | undefined;

	constructor(private comptService: CompetenciasService) {}

	async ngOnInit(): Promise<void> {
		this.competencias = await this.comptService.getAllCompt();
	}
}
