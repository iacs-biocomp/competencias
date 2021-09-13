import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { isBefore, subDays } from 'date-fns';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';
import { CompetenciasService } from 'services/data';
import { pull } from 'lodash';

interface IComptEdit extends ICompGetDTO {
	editing?: boolean;
}

@Component({
	selector: 'table-competencias',
	templateUrl: './table-competencias.component.html',
	styleUrls: ['./table-competencias.component.scss'],
})
export class TableCompetenciasComponent implements OnInit {
	compsToAdd: ICompAddDTO[] = [];
	comps: IComptEdit[] = [];

	constructor(private comptService: CompetenciasService, private readonly logger: LogService) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente TableCompetenciasComponent');
		this.updateCompeView();
	}

	/** Actualiza la vista de competencias */
	async updateCompeView(): Promise<void> {
		this.logger.verbose('Actualizando la vista del componente TableCompetenciasComponent');
		this.comps = await this.comptService.getAll();
	}

	/**
	 * @param competencia la competencia que queremos intentar borrar
	 * @returns 'true' if the competence can be deleted, 'false' otherwise
	 */
	canDelete<T extends Pick<ICompetencia, 'createdAt'>>(competencia: T): boolean {
		const oneWeekAgo = subDays(new Date(), 7);
		return isBefore(oneWeekAgo, competencia.createdAt);
	}

	/**
	 * Busca la competencia a borrar y la elimina
	 * @param comp competencia que se quiere borrar
	 */
	deleteCompToAdd(comp: ICompAddDTO): void {
		this.logger.verbose('Eliminando competencia');
		pull(this.compsToAdd, comp);
	}

	addEmptyComp(): void {
		this.logger.verbose('Creando fila vacía para añadir competencia ');
		this.compsToAdd.push({
			id: '',
			descripcion: '',
		});
	}

	/**
	 *
	 * @param comp La competencia a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa competencia al backend `false` si no
	 */
	editingComp(comp: IComptEdit, editing: boolean, send: boolean): void {
		this.logger.debug(`Editando competencia con ID: ${comp.id}`, comp);
		comp.editing = editing;
		if (send) {
			delete comp.editing;
			this.comptService.edit(comp);
			this.logger.verbose('Enviando competencia al backend');
		}
	}

	/**
	 * Guarda la competencia que acabamos de crear y actualiza la vista
	 *
	 * @param comp la competencia para guardar
	 */
	async persistComp(comp: ICompAddDTO): Promise<void> {
		const guardado = await this.comptService.add(comp);
		this.logger.debug(`Guardando competencia creada con ID: ${comp.id}`, comp);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCompToAdd(comp);
			this.comps.push({ ...comp, createdAt: new Date() });
		}
	}

	/**
	 * Borra la competencia seleccionada y actualiza la vista
	 *
	 * @param comp la competencia a borrar
	 */
	async deleteComp(comp: IComptEdit) {
		this.logger.debug(`Eliminando competencia con ID: ${comp.id}`);
		const borrado = await this.comptService.delete(comp);
		if (borrado) {
			pull(this.comps, comp);
			this.logger.verbose('Competencia eliminada con éxito');
		}
	}
}
