import { Component, OnInit } from '@angular/core';
import { TrabajadoresService, CatCompetencialesService, CatContractService } from 'services/data';
import { ITrabCCompCContrDTO, ITrabajadorDTO, ITrabAddDTO } from 'sharedInterfaces/DTO';
import { ICatContr, ICatComp } from 'sharedInterfaces/Entity';

interface ITrabajadorDTOEdit extends ITrabCCompCContrDTO {
	editing?: boolean;
}

interface ITrabajadorDTOCanEdit extends ITrabajadorDTO {
	editing?: boolean;
	catContr: ICatContr;
	catComp: ICatComp;
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
	//TODO: Tsdoc
	wrkToAdd: ITrabAddDTO[] = [];
	//TODO: Tsdoc
	workers: ITrabajadorDTOCanEdit[] = [];

	constructor(
		private trabService: TrabajadoresService,
		private cCompSv: CatCompetencialesService,
		private cContrSv: CatContractService,
	) {}

	async ngOnInit(): Promise<void> {
		const [, catComps, catContracts] = await Promise.all([
			this.updateWorkerView(),
			this.cCompSv.getAll(),
			this.cContrSv.getAll(),
		]);
		this.catComps = catComps;
		this.catContracts = catContracts;
	}

	async updateWorkerView(): Promise<void> {
		this.workers = await this.trabService.getAll();
	}

	/**
	 * @param worker worker which will be removed from wrkToAdd list
	 */
	deleteWorkerToAdd(worker: Pick<ITrabCCompCContrDTO, 'dni'>): void {
		const indx = this.wrkToAdd.findIndex(wrk => wrk.dni === worker.dni);
		this.wrkToAdd.splice(indx, 1);
	}

	/**   */
	newEmptyWorker(): void {
		this.wrkToAdd.push({
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

	async persistWorker(trab: ITrabAddDTO): Promise<void> {
		const guardado = await this.trabService.add(trab);
		if (guardado) {
			//*PERF: Modificar para añadir el trabajador a la lista sin pedir todos los trabajadores
			await this.updateWorkerView();
			this.deleteWorkerToAdd(trab);
		}
	}
}
