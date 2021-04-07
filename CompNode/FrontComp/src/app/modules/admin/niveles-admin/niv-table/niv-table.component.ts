import { Component, OnInit } from '@angular/core';
import { INivel } from '../../../../../../../interfaces/IEvaluaciones';
import { NivelService } from '../services/nivel.service';

@Component({
  selector: 'app-niv-table',
  templateUrl: './niv-table.component.html',
  styleUrls: ['./niv-table.component.css']
})
export class NivTableComponent implements OnInit {
	constructor(private nivelService: NivelService) {}
	nivelToAdd: INivel[] = [];
	niveles: INivel[] = [];

  async ngOnInit(): Promise<void> {
		this.updateNivelView();
  }

	//TODO: Añadir tsdoc al archivo entero
	async updateNivelView(): Promise<void> {
		this.niveles = await this.nivelService.getAllNiveles();
	}

	canDelete(nivel: INivel): boolean {
		//TODO: Completar
		return true;
	}

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

	async persistNiv(nivel: INivel): Promise<void> {
		const guardado = await this.nivelService.addNivel(nivel);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.updateNivelView();
			this.deleteNivToAdd(nivel);
		}
	}

	async deleteNivel(nivel: INivel) {
		const borrado = await this.nivelService.delete(nivel);
		if(borrado){
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.updateNivelView();
		}
	}
}
