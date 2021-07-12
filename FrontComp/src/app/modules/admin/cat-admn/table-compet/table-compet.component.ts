import { Component, OnInit } from '@angular/core';
import { ICCompAddDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../services/CatCompetenciales.service';

interface ICatCompetEdit extends ICatComp {
	editing?: boolean;
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
	constructor(private catCompService: CatCompetencialesService) {}

	catCompToAdd: ICCompAddDTO[] = [];
	catComps: ICatCompetEdit[] = [];

	async ngOnInit(): Promise<void> {
		await this.updateCatCompView();
	}

	/**
	 * Actualiza las categorías competenciales de manera asincrona
	 */
	async updateCatCompView(): Promise<void> {
		//LOG: `se actualiza la vista de las catCompetenciales`
		this.catComps = await this.catCompService.getAll();
	}

	/**
	 * Elimina una Categoria Competencial de la lista temporal catCompToAdd (Las catComp creadas en memoria no persistidas)
	 *
	 * @param row La catComp a borrar
	 */
	deleteCatCompToAdd(cComp: ICatComp): void {
		//LOG: `se elimina una catComp ${cComp}`
		this.catCompToAdd.splice(this.catCompToAdd.indexOf(cComp), 1);
	}

	/**
	 * Anade una categoría competencial a la lista catCompToAdd (cComps no grabadas en la bbdd)
	 */
	newEmptyCatComp(): void {
		//LOG: `se añade una catComp vacia a la lista de catCompetenciales`
		this.catCompToAdd.push({
			id: '',
			description: '',
		});
	}

	/**
	 *
	 * @param compet La categoria competencial a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa categoria competencia al backend `false` si no
	 */
	async editingCatComp(catComp: ICatCompetEdit, editing: boolean, send: boolean): Promise<void> {
		//LOG: `se edita una catComp ${catComp}, ${editing}, ${send}`
		catComp.editing = editing;
		if (send) {
			delete catComp.editing;
			await this.catCompService.edit(catComp);
		}
	}

	/**
	 * Persiste una categoria competencial
	 *
	 * @param catComp La categoria competencial a persistir
	 * @returns Una promesa void
	 */
	async persistCatComp(catComp: ICCompAddDTO): Promise<void> {
		//LOG: `se persiste una catComp ${catComp}`
		const guardado = await this.catCompService.add(catComp);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCatCompToAdd(catComp);
			return this.updateCatCompView();
		}
	}

	/**
	 * Borra una categoria competencial de la bbdd
	 *
	 * @param catComp La categoria competencial a borrar
	 * @returns Una promesa de tipo void
	 */
	async deleteCatComp(catComp: ICatComp) {
		//LOG: `se elimina una catComp ${catComp}`
		const borrado = await this.catCompService.delete(catComp);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			return this.updateCatCompView();
		}
	}
}
