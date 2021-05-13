import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../services/competencias.service';

interface IComptEdit extends ICompetencia {
	editing?: boolean;
}
// type ICompetenciaDTO = Omit<ICompetencia, 'createdAt'> & {
// 	createdAt: Date | undefined;
// };
@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.css'],
})
export class TableCompetenciasComponent implements OnInit {
	compeToAdd: ICompetencia[] = [];
	compets: IComptEdit[] = [];
	hoy: Date = new Date();
	OneWeekAgo!: Date;

	constructor(private comptService: CompetenciasService) {}

	//TODO: Añadir tsdoc a los metodos y atributos de la clase

	async ngOnInit(): Promise<void> {
		this.OneWeekAgo = new Date();
		this.OneWeekAgo.setDate(this.hoy.getDate() - 7);
		this.updateCompeView();
	}

	async updateCompeView(): Promise<void> {
		this.compets = await this.comptService.getAll();
		console.log('update');
	}

	canDelete(competencia: ICompetencia): boolean {
		return competencia.createdAt! <= this.OneWeekAgo ? false : true;
	}

	deleteCompeToAdd(row: ICompetencia): void {
		const indx = this.compeToAdd.indexOf(row);
		this.compeToAdd.splice(indx, 1);
	}

	newEmptyCompe(): void {
		this.compeToAdd.push({
			id: '',
			descripcion: '',
			createdAt: undefined,
		});
	}

	/**
	 *
	 * @param compet La competencia a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa competencia al backend `false` si no
	 */
	editingCompt(compet: IComptEdit, editing: boolean, send: boolean): void {
		compet.editing = editing;
		if (send) {
			delete compet.editing;
			this.comptService.editCompt(compet);
		}
	}

	async persistCompe(competencia: ICompetencia): Promise<void> {
		const guardado = await this.comptService.addCompeten(competencia);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCompeToAdd(competencia);
			await this.updateCompeView();
		}
	}

	async deleteCompe(competencia: ICompetencia) {
		const borrado = await this.comptService.delete(competencia);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateCompeView();
		}
	}
}
