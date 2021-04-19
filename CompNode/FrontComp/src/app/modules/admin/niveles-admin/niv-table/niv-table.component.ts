import { Component, OnInit } from '@angular/core';
import { INivel } from '../../../../../../../interfaces/IEvaluaciones';
import { NivelService } from '../services/nivel.service';

interface INivelEdit extends INivel {
	editing?: boolean;
}

@Component({
	selector: 'app-niv-table',
	templateUrl: './niv-table.component.html',
	styleUrls: ['./niv-table.component.css'],
})
export class NivTableComponent implements OnInit {
	constructor(private nivelService: NivelService) {}
	nivelToAdd: INivel[] = [];
	niveles: INivelEdit[] = [];

	async ngOnInit(): Promise<void> {
		this.updateNivelView();
	}

	/** Metodo que sincroniza los niveles de la vista con los del backend */
	async updateNivelView(): Promise<void> {
		this.niveles = await this.nivelService.getAll();
	}

	canDelete(nivel: INivel): boolean {
		//TODO: Completar
		return true;
	}

	/**
	 *  Elimina un nivel de la listta nivelToAdd
	 * @param row El nivel a eliminar
	 */
	deleteNivToAdd(row: INivel): void {
		const indx = this.nivelToAdd.indexOf(row);
		this.nivelToAdd.splice(indx, 1);
	}

	newEmptyNivel(): void {
		this.nivelToAdd.push({
			id: '',
			valor: 0,
			subModels: undefined,
		});
	}

	/**
	 *
	 * @param compet El nivel a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar ese nivel al backend `false` si no
	 */
	editingNivel(nivel: INivelEdit, editing: boolean, send: boolean): void {
		nivel.editing = editing;
		if (send) {
			delete nivel.editing;
			this.nivelService.editNivel(nivel);
		}
	}

	async persistNiv(nivel: INivel): Promise<void> {
		const guardado = await this.nivelService.add(nivel);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateNivelView();
			this.deleteNivToAdd(nivel);
		}
	}

	async deleteNivel(nivel: INivel) {
		const borrado = await this.nivelService.delete(nivel);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			await this.updateNivelView();
		}
	}
}
