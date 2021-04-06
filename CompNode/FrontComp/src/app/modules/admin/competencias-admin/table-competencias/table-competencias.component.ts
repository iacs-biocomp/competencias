import { Component, OnInit } from '@angular/core';
import { ICompetencia } from '../../../../../../../interfaces/IEvaluaciones';
import { CompetenciasService } from '../services/competencias.service';

@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.css'],
})
export class TableCompetenciasComponent implements OnInit {
	comptToAdd: ICompetencia[] = [];

	competencias: ICompetencia[] | undefined;

	hoy: Date = new Date();
	OneWeekAgo!: Date;

	//TODO: Añadir tsdoc a los metodos y atributos de la clase
	//TODO: Cambiar nombres funciones a ingles para acortar, p.ej sePuedeBorrar() => canDel()

	constructor(private comptService: CompetenciasService) {}

	async ngOnInit(): Promise<void> {
		this.OneWeekAgo = new Date();
		this.OneWeekAgo.setDate(this.hoy.getDate() - 7);

		this.competencias = await this.comptService.getAllCompt();
	}

	sePuedeBorrar(competencia: ICompetencia): boolean {
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	async borrarCompt(competencia: ICompetencia) {
		const borrado = await this.comptService.borrarCompt(competencia.id);
		if (borrado) {
			const indx = this.comptToAdd.indexOf(competencia);
			this.comptToAdd.splice(indx, 1);
		}
	}

	async addComp(competencia: ICompetencia): Promise<void> {
		if (!competencia) {
			return;
		}
		//TODO: Excepción aqui casi seguro q mete, solucionar
		await this.comptService.addComp(competencia);
	}

	onAddRow() {
		var currentElement = this.competencias?.length;
		this.competencias?.splice(this.competencias?.length, 0);
	}
}
