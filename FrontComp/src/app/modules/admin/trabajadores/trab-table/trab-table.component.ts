import { Component, OnInit } from '@angular/core';
import { ITrabajadorDTO, ITrabCCompCContrDTO } from 'sharedInterfaces/DTO';
import { ICatComp, ICatContr } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { CatContractService } from '../../cat-admn/services/CatContractuales.service';
import { TrabajadoresService } from '../services/trabajadores.service';

interface ITrabajadorDTOEdit extends ITrabCCompCContrDTO {
	editing?: boolean;
}

interface ITrabajadorDTOCanEdit extends ITrabajadorDTO {
	editing?: boolean;
	catContr: ICatContr;
	catComp: ICatComp
}

@Component({
	selector: 'app-trab-table',
	templateUrl: './trab-table.component.html',
	styleUrls: ['./trab-table.component.scss'],
})
export class TrabTableComponent implements OnInit {
	/** Lista de todas las categorías competenciales */
	catComps!: ICatComp[];
	/** Lista de todas las categorías contractuales */
	catContracts!: ICatContr[];
	/** Lista de todas las categorías contractuales */
	listaTrabaToAdd: ITrabajadorDTOEdit[] = [];
	/** Lista de todas las categorías contractuales */
	trabajadores: ITrabajadorDTOCanEdit[] = [];

	constructor(
		/** Servicio para obtener los datos de los trabajadores */
		private trabService: TrabajadoresService,
		/** Servicio para obtener los datos de las catCompetenciales */
		private cCompSv: CatCompetencialesService,
		/** Servicio para obtener los datos de las catContractuales */
		private cContrSv: CatContractService,
	) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.updateWorkerView(),
			this.cCompSv.getAll(),
			this.cContrSv.getAll(),
		]);
		this.catComps = promises[1];
		this.catContracts = promises[2];
	}

	async updateWorkerView(): Promise<void> {
		this.trabajadores = await this.trabService.getAll();
	}

	/** Metodo que borra un trabajador de los que se iban a añadir y aun no se habian mandado al backend */
	deleteWorkerToAdd(row: ITrabCCompCContrDTO): void {
		const indx = this.listaTrabaToAdd.indexOf(row);
		this.listaTrabaToAdd.splice(indx, 1);
	}

	/** Añade a la lista listaTrabaToAdd uno nuevo  */
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
			this.trabService.edit(trab);
		}
	}

	async persistWorker(trab: ITrabCCompCContrDTO): Promise<void> {
		const guardado = await this.trabService.add(trab);
		if (guardado) {
			//*PERF: Modificar para añadir el trabajador a la lista sin pedir todos los trabajadores
			await this.updateWorkerView();
			this.deleteWorkerToAdd(trab);
		}
	}
}
