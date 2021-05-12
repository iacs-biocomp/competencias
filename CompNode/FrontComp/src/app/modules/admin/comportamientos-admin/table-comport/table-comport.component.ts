import { Component, OnInit } from '@angular/core';
import { IComportamiento } from 'sharedInterfaces/Entity/IEvaluaciones';
import { ComportService } from '../services/comport.service';

interface IComportEdit extends IComportamiento {
	editing?: boolean;
}

@Component({
	selector: 'app-table-comport',
	templateUrl: './table-comport.component.html',
	styleUrls: ['./table-comport.component.css'],
})
export class TableComportComponent implements OnInit {
	constructor(private comportService: ComportService) {}
	comportToAdd: IComportamiento[] = [];
	comports: IComportEdit[] = [];

	async ngOnInit(): Promise<void> {
		await this.updateComportView();
	}
	/** Metodo que sincroniza la vista con el backend (La lista de comportamiento) */
	async updateComportView(): Promise<void> {
		this.comports = await this.comportService.getAll();
	}

	deleteComptToAdd(row: IComportamiento): void {
		const indx = this.comportToAdd.indexOf(row);
		this.comportToAdd.splice(indx, 1);
	}

	/** Añade un nuevo comportamiento al array de comportToAdd */
	newEmptyCompt(): void {
		this.comportToAdd.push({
			id: '',
			descripcion: '',
			subModels: undefined,
		});
	}

	/**
	 *
	 * @param compet La competencia a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa competencia al backend `false` si no
	 */
	editingComport(comport: IComportEdit, editing: boolean, send: boolean): void {
		comport.editing = editing;
		if (send) {
			delete comport.editing;
			this.comportService.editCompt(comport);
		}
	}

	canDelete(comport: IComportamiento): boolean {
		return true;
	}

	async persistComport(comport: IComportamiento): Promise<void> {
		const guardado = await this.comportService.addComport(comport);
		if (guardado) {
			await this.updateComportView();
			this.deleteComptToAdd(comport);
		}
	}

	async deleteComport(comport: IComportamiento) {
		const borrado = await this.comportService.delete(comport);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateComportView();
		}
	}
}
