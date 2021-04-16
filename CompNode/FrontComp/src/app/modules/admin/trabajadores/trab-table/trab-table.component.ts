import { Component, OnInit } from '@angular/core';
import { TrabajadoresService } from '../services/trabajadores.service';
import { ITrabajadorDTO } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { ICatComp, ICatContr } from '../../../../../../../interfaces/ICategorias';
import { CatContractService } from '../../cat-admn/services/CatContractuales.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';

interface ITrabajadorDTOEdit extends ITrabajadorDTO {
	editing?: boolean;
}

@Component({
	selector: 'app-trab-table',
	templateUrl: './trab-table.component.html',
	styleUrls: ['./trab-table.component.css'],
})
export class TrabTableComponent implements OnInit {
	constructor(
		/** Servicio para obtener los datos de los trabajadores */
		private trabService: TrabajadoresService,
		/** Servicio para obtener los datos de las catCompetenciales */
		private cCompSv: CatCompetencialesService,
		/** Servicio para obtener los datos de las catContractuales */
		private cContrSv: CatContractService,
	) {}
	//TODO: Tsdoc a variables
	catComps!: ICatComp[];
	catContracts!: ICatContr[];
	listaTrabaToAdd: ITrabajadorDTOEdit[] = [];
	trabajadores: ITrabajadorDTOEdit[] = [];

	async ngOnInit(): Promise<void> {
		await this.updateWorkerView();
		this.catComps = await this.cCompSv.getAll();
		this.catContracts = await this.cContrSv.getAll();
	}

	//TODO: Añadir tsdoc a los metodos
	async updateWorkerView(): Promise<void> {
		this.trabajadores = await this.trabService.getAllTrabajadores();
	}

	deleteWorkerToAdd(row: ITrabajadorDTO): void {
		const indx = this.listaTrabaToAdd.indexOf(row);
		this.listaTrabaToAdd.splice(indx, 1);
	}

	newEmptyWorker(): void {
		this.listaTrabaToAdd.push({
			dni: '',
			nombre: '',
			apellidos: '',
			area: '',
			unidad: '',
			departamento: '',
			catComp: '',
			catContr: '',
			deleteable: true,
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
}
