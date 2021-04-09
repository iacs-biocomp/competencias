import { Component, OnInit } from '@angular/core';
import { TrabajadoresService } from '../services/trabajadores.service';
import { ITrabajadorDTO } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';

interface ITrabajadorDTOEdit extends ITrabajadorDTO {
	editing?: boolean;
}

@Component({
	selector: 'app-trab-table',
	templateUrl: './trab-table.component.html',
	styleUrls: ['./trab-table.component.css'],
})
export class TrabTableComponent implements OnInit {
	constructor(private trabService: TrabajadoresService) {}
	listaTraba: ITrabajadorDTO[] = [
		{
			dni: '132DF',
			nombre: 'jORGE',
			apellidos: 'PEREZ',
			area: 'BIOC',
			unidad: 'BI',
			departamento: 'BIOC',
			catComp: 'GR1',
			catContr: "INV-SENIOR"
		},
		{
			dni: 'DSFDSF5',
			nombre: 'GDD',
			apellidos: 'PEFDFDREZ',
			area: 'DFDF',
			unidad: 'DFDF',
			departamento: 'BIOC',
			catComp: 'GR2',
			catContr: "INV-SENIOR"
		},
	];
	trabajadores: ITrabajadorDTOEdit[] = [];

	async ngOnInit(): Promise<void> {
		// this.listaTraba = await this.trabService.getAllTrabajadores();
		// this.listaTraba = await this.trabService.getCatCompeten();
	}

	//TODO: Añadir tsdoc al archivo entero
	async updateWorkerView(): Promise<void> {
		this.trabajadores = await this.trabService.getAllTrabajadores();
	}

	canDelete(trab: ITrabajadorDTO): boolean {
		//TODO: Completar
		return true;
	}

	deleteWorkerToAdd(row: ITrabajadorDTO): void {
		const indx = this.listaTraba.indexOf(row);
		this.listaTraba.splice(indx, 1);
	}

	newEmptyWorker(): void {
		this.listaTraba.push({
			dni: '',
			nombre: '',
			apellidos: '',
			area: '',
			unidad: '',
			departamento: '',
			catComp: '',
			catContr: ""
		});
	}

	/**
	 *
	 * @param compet El nivel a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar ese nivel al backend `false` si no
	 */
	editingWorker(trab: ITrabajadorDTOEdit, editing: boolean, send: boolean): void {
		trab.editing = editing;
		if (send) {
			delete trab.editing;
			this.trabService.editTrabajador(trab);
		}
	}

	async persistWorker(trab: ITrabajadorDTO): Promise<void> {
		const guardado = await this.trabService.addTrabajador(trab);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateWorkerView();
			this.deleteWorkerToAdd(trab);
		}
	}

	async deleteWorker(trab: ITrabajadorDTO) {
		const borrado = await this.trabService.delete(trab);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateWorkerView();
		}
	}
}
