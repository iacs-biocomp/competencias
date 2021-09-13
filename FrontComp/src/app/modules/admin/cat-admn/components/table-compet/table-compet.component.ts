import { Component, OnInit } from '@angular/core';
import { CatCompetencialesService } from 'services/data';
import { ICCompAddDTO, ICCompCContrDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';
import { pull } from 'lodash';

interface ICCompEditable extends ICCompCContrDTO {
	isInEditMode?: boolean;
}

/**
 * Component used for competency category viewing / editing
 */
@Component({
	selector: 'app-table-compet',
	templateUrl: './table-compet.component.html',
	styleUrls: ['./table-compet.component.scss'],
})
export class TableCatCompComponent implements OnInit {
	constructor(private catCompService: CatCompetencialesService, private readonly logger: LogService) {}

	cCompToAdd: ICCompAddDTO[] = [];
	catComps: ICCompEditable[] = [];

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente table-compet');
		await this.updateCatCompView();
	}

	async updateCatCompView(): Promise<void> {
		this.logger.verbose('Actualizando vista de TableCatCompComponent');
		this.catComps = await this.catCompService.getAll();
	}

	/**
	 * Elimina una Categoria Competencial de la lista temporal catCompToAdd (Las catComp creadas en memoria no persistidas)
	 *
	 * @param cComp La catComp a borrar
	 */
	deleteCatCompToAdd(cComp: ICCompAddDTO): void {
		this.logger.debug('Eliminando catComp de la vista de edición', cComp);
		pull(this.cCompToAdd, cComp);
	}

	/**
	 * Anade una categoría competencial a la lista catCompToAdd (cComps no grabadas en la bbdd)
	 */
	newEmptyCatComp(): void {
		this.logger.debug('Creando añadiendo a cCompToAdd catComp vacia');
		this.cCompToAdd.push({
			id: '',
			description: '',
		});
	}

	/**
	 *
	 * @param cComp La categoria competencial a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa categoria competencia al backend `false` si no
	 */
	async editingCatComp(cComp: ICCompEditable, editing: boolean, send: boolean): Promise<void> {
		this.logger.debug(
			`Editando cComp con ID: ${cComp.id}, ¿mostrar input en descripcion?: ${editing}, ¿mandar al backend?: ${send}`,
			cComp,
		);
		cComp.isInEditMode = editing;
		if (send) {
			delete cComp.isInEditMode;
			await this.catCompService.edit(cComp);
		}
	}

	/**
	 * Persiste una categoria competencial
	 *
	 * @param cComp La categoria competencial a persistir
	 * @returns Una promesa void
	 */
	async persistCatComp(cComp: ICCompAddDTO): Promise<void> {
		this.logger.debug(`Persistiendo cComp con ID: ${cComp.id}`, cComp);
		const guardado = await this.catCompService.add(cComp);
		if (guardado) {
			this.deleteCatCompToAdd(cComp);
			this.catComps.push({ ...cComp, catContr: [] });
		}
	}

	/**
	 * Borra una categoria competencial de la bbdd
	 *
	 * @param catComp La categoria competencial a borrar
	 * @returns Void promise
	 */
	async deleteCatComp(cComp: ICCompEditable): Promise<void> {
		this.logger.debug(`Eliminando cComp con ID: ${cComp.id}`);
		const borrado = await this.catCompService.delete(cComp);
		if (borrado) {
			this.logger.verbose('Borrada cComp con exito');
			pull(this.catComps, cComp);
			return this.updateCatCompView();
		}
	}
}
