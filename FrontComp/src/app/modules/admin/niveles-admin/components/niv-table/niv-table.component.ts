import { Component, OnInit } from '@angular/core';
import { NivelService } from 'services/data';
import { INivel } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

interface INivelEdit extends INivel {
	editing?: boolean;
}
export type INivelToAdd = Omit<INivel, 'id'>;

@Component({
	selector: 'app-niv-table',
	templateUrl: './niv-table.component.html',
	styleUrls: ['./niv-table.component.scss'],
})
export class NivTableComponent implements OnInit {
	constructor(private nivelService: NivelService, private readonly logger: LogService) {}
	/** Array con los niveles que se añadiran y mandaran al backend  */
	nivelesToAdd: INivelToAdd[] = [];
	/** Array con las referencias de los niveles */
	niveles: INivelEdit[] = [];

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Inicializando componente niv-table');
		this.updateNivelView();
	}

	/** Metodo que sincroniza los niveles de la vista con los del backend */
	async updateNivelView(): Promise<void> {
		this.logger.verbose('Actualizando la vista del componente');
		this.niveles = await this.nivelService.getAllRefNivs();
	}

	/**
	 *  Elimina un nivel de la listta nivelToAdd
	 *
	 * @param row El nivel a eliminar
	 */
	deleteNivToAdd(nivel: INivelToAdd): void {
		const indx = this.nivelesToAdd.indexOf(nivel);
		this.logger.verbose('Eliminando fila de la lista de niveles a añadir');
		this.nivelesToAdd.splice(indx, 1);
	}

	newEmptyNivel(): void {
		this.logger.verbose('Añadiendo una fila vacía');
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
		this.logger.debug(`Editando un nivel:`, nivel);
		nivel.editing = editing;
		if (send) {
			delete nivel.editing;
			this.logger.verbose('Nivel enviado con éxito');
			this.nivelService.edit(nivel);
		}
	}

	/**
	 *
	 * @param nivel el objeto que queremos guardar en el backend
	 */
	async persistNiv(nivel: INivelToAdd): Promise<void> {
		this.logger.debug(`Guardando un nivel:`, nivel);
		const guardado = await this.nivelService.add(nivel);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.logger.verbose('Nivel guardado con éxito');
			await this.updateNivelView();
			this.deleteNivToAdd(nivel);
		}
	}

	/**
	 *
	 * @param nivel el nivel que se borrara de la base de datos
	 */
	async deleteNivel(nivel: INivel) {
		this.logger.debug(`Borrando un nivel`, nivel);
		const borrado = await this.nivelService.delete(nivel);
		if (borrado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.logger.verbose('Nivel borrado con éxito');
			await this.updateNivelView();
		}
	}
}
