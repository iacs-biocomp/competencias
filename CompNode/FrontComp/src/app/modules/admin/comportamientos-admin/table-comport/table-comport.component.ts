import { Component, OnInit } from '@angular/core';
import { IComportamiento } from '../../../../../../../interfaces/IEvaluaciones';
import { ComportService } from '../services/comport.service';

@Component({
	selector: 'app-table-comport',
	templateUrl: './table-comport.component.html',
	styleUrls: ['./table-comport.component.css'],
})
export class TableComportComponent implements OnInit {
	constructor(private comportService: ComportService) {}
	comportToAdd: IComportamiento[] = [];
	comports: IComportamiento[] = [];

	//TODO: Añadir tsdoc a los metodos y atributos de la clase

	async ngOnInit(): Promise<void> {
		// setInterval(() => {
		// 	console.log(this.comportToAdd);
		// }, 2500);
		await this.updateComportView();
	}
	async updateComportView(): Promise<void> {
		this.comports = await this.comportService.getAllComport();
	}

	deleteComptToAdd(row: IComportamiento): void {
		const indx = this.comportToAdd.indexOf(row);
		this.comportToAdd.splice(indx, 1);
	}

	newEmptyCompt(): void {
		this.comportToAdd.push({
			id: '',
			descripcion: '',
			subModels: undefined,
		});
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
