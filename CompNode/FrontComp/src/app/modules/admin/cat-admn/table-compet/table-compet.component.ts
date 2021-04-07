import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../../interfaces/ICategorias';
import { CatCompetencialesService } from '../services/CatCompetenciales.service';

@Component({
	selector: 'app-table-compet',
	templateUrl: './table-compet.component.html',
	styleUrls: ['./table-compet.component.css'],
})
export class TableCompetComponent implements OnInit {
	constructor(private catCompService: CatCompetencialesService) {}
	catCompToAdd: ICatComp[] = [];
	catComps: ICatComp[] = [];

	//TODO: Añadir tsdoc a los metodos y atributos de la clase

	async ngOnInit(): Promise<void> {
		this.updateCatCompView();
	}

	async updateCatCompView(): Promise<void> {
		this.catComps = await this.catCompService.getAllCatComp();
	}

	canDelete(catComp: ICatComp): boolean {
		return false;
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

	async persistCatComp(catComp: ICatComp): Promise<void> {
		const guardado = await this.catCompService.addCatComp(catComp);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.updateCatCompView();
			this.deleteCatCompToAdd(catComp);
		}
	}

	async deleteCatComp(catComp: ICatComp) {
		const borrado = await this.catCompService.delete(catComp);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.updateCatCompView();
		}
	}
}
