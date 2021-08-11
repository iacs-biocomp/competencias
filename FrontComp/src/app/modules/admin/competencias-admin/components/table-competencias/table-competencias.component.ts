import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../../../../../services/data/competencias.service';
import { addDays } from 'date-fns';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';

interface IComptEdit extends ICompGetDTO {
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
	compeToAdd: ICompAddDTO[] = [];
	compets: IComptEdit[] = [];
	today = new Date();
	OneWeekAgo = addDays(new Date(), -7);

	constructor(private comptService: CompetenciasService) {}

	async ngOnInit(): Promise<void> {
		this.updateCompeView();
	}

	/** Actualiza la vista de competencias */
	async updateCompeView(): Promise<void> {
		//LOG: `se actualiza la vista de las comps`
		this.compets = await this.comptService.getAll();
		console.log('update');
	}

	/** Devuelve un booleano con true si se puede borrar y false si no;
	 * esto depende de si la competencia tiene más de una semana desde que se
	 * creó (return true), o no (return false)
	 *
	 * @param competencia la competencia que queremos intentar borrar
	 */
	canDelete<T extends Pick<ICompetencia, 'createdAt'>>(competencia: T): boolean {
		//LOG: `comprueba si se puede borrar la comp o no ${competencia}`
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	/**
	 * Busca la competencia a borrar y la elimina
	 * @param row competencia que se quiere borrar
	 */
	deleteCompeToAdd(row: ICompAddDTO): void {
		//LOG: `se elimina una comp ${row}`
		const indx = this.compeToAdd.indexOf(row);
		this.compeToAdd.splice(indx, 1);
	}

	/** Crea una competencia vacia con id, descripcion y
	 * fecha de creacion (puede ser undefined)
	 */
	newEmptyCompe(): void {
		//LOG: `se crea una comp vacia`
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
		//LOG: `se edita una comp ${compet}, ${editing}, ${send}`
		compet.editing = editing;
		if (send) {
			delete compet.editing;
			this.comptService.edit(compet);
		}
	}

	/**
	 * Guarda la competencia que acabamos de crear y actualiza la vista
	 *
	 * @param competencia la competencia para guardar
	 */
	async persistCompe(competencia: ICompAddDTO): Promise<void> {
		const guardado = await this.comptService.add(competencia);
		//LOG: `se periste una comp ${competencia}`
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
		//LOG: `se elimina una comp ${competencia}`
		const borrado = await this.comptService.delete(competencia);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateCompeView();
		}
	}
}
