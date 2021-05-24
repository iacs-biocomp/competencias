import { Component, OnInit } from '@angular/core';
import { INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../services/nivel.service';

interface INivelEdit extends INivel {
	editing?: boolean;
}
// Omit<INivel, 'id'>
export interface INivelToAdd extends Omit<INivel, 'id'> {}

@Component({
	selector: 'app-niv-table',
	templateUrl: './niv-table.component.html',
	styleUrls: ['./niv-table.component.css'],
})
export class NivTableComponent implements OnInit {
	constructor(private nivelService: NivelService) {}
	nivelesToAdd: INivelToAdd[] = [];
	niveles: INivelEdit[] = [];

	async ngOnInit(): Promise<void> {
		this.updateNivelView();
	}

	/** Metodo que sincroniza los niveles de la vista con los del backend */
	async updateNivelView(): Promise<void> {
		// TODO: Hay que cambiarla por la nueva del servicio
		this.niveles = await this.nivelService.getAll();
	}

	/**
	 *  Elimina un nivel de la listta nivelToAdd
	 * @param row El nivel a eliminar
	 */
	deleteNivToAdd(nivel: INivelToAdd): void {
		const indx = this.nivelesToAdd.indexOf(nivel);
		this.nivelesToAdd.splice(indx, 1);
	}

	newEmptyNivel(): void {
		this.nivelesToAdd.push({
			code: '',
			valor: 0,
			maxRango: 0,
			minRango: 0,
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

	async persistNiv(nivel: INivelToAdd): Promise<void> {
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
