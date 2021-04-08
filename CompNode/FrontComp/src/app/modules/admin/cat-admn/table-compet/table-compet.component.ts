import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../../interfaces/ICategorias';
import { CatCompetencialesService } from '../services/CatCompetenciales.service';

interface ICatCompetEdit extends ICatComp {
	editing?: boolean;
}
@Component({
	selector: 'app-table-compet',
	templateUrl: './table-compet.component.html',
	styleUrls: ['./table-compet.component.css'],
})
export class TableCompetComponent implements OnInit {
	constructor(private catCompService: CatCompetencialesService) {}

	catCompToAdd: ICatComp[] = [];
	catComps: ICatCompetEdit[] = [];

	//TODO: Añadir tsdoc a los metodos y atributos de la clase

	async ngOnInit(): Promise<void> {
		this.updateCatCompView();
	}

	async updateCatCompView(): Promise<void> {
		this.catComps = await this.catCompService.getAllCatComp();
		console.log('update')
	}

	canDelete(catComp: ICatComp): boolean {
		return true;
	}

	deleteCatCompToAdd(row: ICatComp): void {
		const indx = this.catCompToAdd.indexOf(row);
		this.catCompToAdd.splice(indx, 1);
	}

	newEmptyCatComp(): void {
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
	 editingCatComp(catComp: ICatCompetEdit, editing: boolean, send: boolean): void {
		catComp.editing = editing;
		if (send) {
			delete catComp.editing;
			this.catCompService.editCompt(catComp);
		}
	}


	async persistCatComp(catComp: ICatComp): Promise<void> {
		const guardado = await this.catCompService.addCatComp(catComp);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCatCompToAdd(catComp);
			await this.updateCatCompView();
		}
	}

	async deleteCatComp(catComp: ICatComp) {
		const borrado = await this.catCompService.delete(catComp);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateCatCompView();
		}
	}
}
