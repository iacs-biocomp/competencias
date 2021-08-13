import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { CompetenciasService } from '../../../../../services/data/competencias.service';
import { addDays } from 'date-fns';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

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

	constructor(private comptService: CompetenciasService, private readonly logger: LogService) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente table-competencias');
		this.updateCompeView();
	}

	/** Actualiza la vista de competencias */
	async updateCompeView(): Promise<void> {
		this.logger.verbose('Actualizando la vista del componente');
		this.compets = await this.comptService.getAll();
	}

	/** Devuelve un booleano con true si se puede borrar y false si no;
	 * esto depende de si la competencia tiene más de una semana desde que se
	 * creó (return true), o no (return false)
	 *
	 * @param competencia la competencia que queremos intentar borrar
	 */
	canDelete<T extends Pick<ICompetencia, 'createdAt'>>(competencia: T): boolean {
		//!!No deja de logar
		this.logger.verbose(
			`Comprobando si la competencia tiene más de una semana de creación y se puede borrar. Fecha de creación: ${competencia.createdAt}`,
		);
		return competencia.createdAt <= this.OneWeekAgo ? false : true;
	}

	/**
	 * Busca la competencia a borrar y la elimina
	 * @param comp competencia que se quiere borrar
	 */
	deleteCompeToAdd(comp: ICompAddDTO): void {
		this.logger.verbose('Eliminando competencia');
		const indx = this.compeToAdd.indexOf(comp);
		this.compeToAdd.splice(indx, 1);
	}

	/** Crea una competencia vacia con id, descripcion y
	 * fecha de creacion (puede ser undefined)
	 */
	newEmptyCompe(): void {
		this.logger.verbose('Creando fila vacía para añadir competencia ');
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
		this.logger.debug(`Editando competencia con ID: ${compet.id}`, compet);
		compet.editing = editing;
		if (send) {
			delete compet.editing;
			this.comptService.edit(compet);
			this.logger.verbose('Enviando competencia al backend');
		}
	}

	/**
	 * Guarda la competencia que acabamos de crear y actualiza la vista
	 *
	 * @param competencia la competencia para guardar
	 */
	async persistCompe(competencia: ICompAddDTO): Promise<void> {
		const guardado = await this.comptService.add(competencia);
		this.logger.debug(`Guardando competencia creada con ID: ${competencia.id}`, competencia);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCompeToAdd(competencia);
			await this.updateCompeView();
			this.logger.verbose('Competencia guardada correctamente en la lista all competencias');
		}
	}

	/**
	 * Borra la competencia seleccionada y actualiza la vista
	 *
	 * @param competencia la competencia a borrar
	 */
	async deleteCompe(competencia: ICompetencia) {
		this.logger.debug(`Eliminando competencia con ID: ${competencia.id}`);
		const borrado = await this.comptService.delete(competencia);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.logger.verbose('Competencia eliminada con éxito');
			await this.updateCompeView();
		}
	}
}
