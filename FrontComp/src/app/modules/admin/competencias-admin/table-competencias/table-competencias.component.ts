import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../services/competencias.service';
import { addDays } from 'date-fns';
import { CompetAddDTO } from 'sharedInterfaces/DTO';

interface IComptEdit extends ICompetencia {
	editing?: boolean;
}

// type ICompetenciaDTO = Omit<ICompetencia, 'createdAt'> & {
// 	createdAt: Date | undefined;
// };
@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.scss'],
})
export class TableCompetenciasComponent implements OnInit {
	compeToAdd: CompetAddDTO[] = [];
	compets: IComptEdit[] = [];
	today = new Date();
	OneWeekAgo = addDays(new Date(), -7);

	constructor(private comptService: CompetenciasService) {}

	async ngOnInit(): Promise<void> {
		this.updateCompeView();
	}

	/** Actualiza la vista de competencias */
	async updateCompeView(): Promise<void> {
		this.compets = await this.comptService.getAll();
		console.log('update');
	}

	/** Devuelve un booleano con true si se puede borrar y false si no;
	 * esto depende de si la competencia tiene más de una semana desde que se
	 * creó (return true), o no (return false)
	 *
	 * @param competencia la competencia que queremos intentar borrar
	 */
	canDelete(competencia: ICompetencia): boolean {
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	/**
	 * Busca la competencia a borrar y la elimina
	 * @param row competencia que se quiere borrar
	 */
	deleteCompeToAdd(row: CompetAddDTO): void {
		const indx = this.compeToAdd.indexOf(row);
		this.compeToAdd.splice(indx, 1);
	}

	/** Crea una competencia vacia con id, descripcion y
	 * fecha de creacion (puede ser undefined)
	 */
	newEmptyCompe(): void {
		this.compeToAdd.push({
			id: '',
			descripcion: '',
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

	/**
	 * Guarda la competencia que acabamos de crear y actualiza la vista
	 *
	 * @param competencia la competencia para guardar
	 */
	async persistCompe(competencia: CompetAddDTO): Promise<void> {
		const guardado = await this.comptService.addCompeten(competencia);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCompeToAdd(competencia);
			await this.updateCompeView();
		}
	}

	/**
	 * Borra la competencia seleccionada y actualiza la vista
	 *
	 * @param competencia la competencia a borrar
	 */
	async deleteCompe(competencia: ICompetencia) {
		const borrado = await this.comptService.delete(competencia);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateCompeView();
		}
	}
}
