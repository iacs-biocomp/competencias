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

	async ngOnInit(): Promise<void> {
		// setInterval(() => {
		// 	console.log(this.comportToAdd);
		// }, 2500);
		this.updateComportView();
	}
	//TODO: Añadir tsdoc al archivo entero
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
		//TODO: Completar
		return false;
	}

	async persistComport(comport: IComportamiento): Promise<void> {
		const guardado = await this.comportService.addComport(comport);
		if (guardado) {
			this.updateComportView();
			this.deleteComptToAdd(comport);
		}
	}

	deleteComport(comport: IComportamiento) {
		this.comportService.delete(comport);
	}
}
