import { Component, OnInit } from '@angular/core';
import { ICompetencia } from '../../../../../../../interfaces/IEvaluaciones';
import { CompetenciasService } from '../services/competencias.service';

@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.css'],
})
export class TableCompetenciasComponent implements OnInit {
	constructor(private comptService: CompetenciasService) {}
	compeToAdd: ICompetencia[] = [];
	compets: ICompetencia[] = [];
	hoy: Date = new Date();
	OneWeekAgo!: Date;

	//TODO: Añadir tsdoc a los metodos y atributos de la clase

	async ngOnInit(): Promise<void> {
		this.OneWeekAgo = new Date();
		this.OneWeekAgo.setDate(this.hoy.getDate() - 7);
		this.updateCompeView();
	}

	async updateCompeView(): Promise<void> {
		this.compets = await this.comptService.getAllCompt();
	}

	canDelete(competencia: ICompetencia): boolean {
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	deleteCompeToAdd(row: ICompetencia): void {
		const indx = this.compeToAdd.indexOf(row);
		this.compeToAdd.splice(indx, 1);
	}

	newEmptyCompe(): void {
		this.compeToAdd.push({
			id: '',
			descripcion: '',
			createdAt: new Date(0), //poner en null una Date?
		});
	}

	async persistCompe(competencia: ICompetencia): Promise<void> {
		const guardado = await this.comptService.addCompeten(competencia);
		if (guardado) {
			this.updateCompeView();
			this.deleteCompeToAdd(competencia);
		}
	}

	deleteCompe(competencia: ICompetencia) {
		this.comptService.delete(competencia);
	}
}
