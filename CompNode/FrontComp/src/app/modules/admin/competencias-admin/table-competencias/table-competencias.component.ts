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

	hoy: Date = new Date();
	OneWeekAgo!: Date;

	constructor(private comptService: CompetenciasService) {}

	async ngOnInit(): Promise<void> {
		this.OneWeekAgo = new Date();
		this.OneWeekAgo.setDate(this.hoy.getDate() - 7);

		this.competencias = await this.comptService.getAllCompt();
	}

	sePuedeBorrar(competencia: ICompetencia): boolean {
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	borrarCompt(competencia: ICompetencia) {
		const borrado = this.comptService.borrarCompt(competencia.id);
		if (borrado) {
			const index =  this.competencias?.indexOf(competencia)
			delete this.competencias![index!];
		}
	}

	aniadirComp(competencia: ICompetencia): void {
		if (!competencia) {
			return;
		}
		this.comptService.addComp(competencia).subscribe((CompetenciasService) => {
			this.competencias?.push(CompetenciasService);
		});
	}

	onAddRow() {
		var currentElement = this.competencias?.length;
		this.competencias?.splice(this.competencias?.length, 0);
	}
}
