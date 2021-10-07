import { Component, OnInit } from '@angular/core';
import { CatContractService, CatCompetencialesService } from 'services/data';
import { ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr, ICatComp } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

interface IContracEdit extends ICatContr {
	editing?: boolean;
}
@Component({
	selector: 'app-table-contrac',
	templateUrl: './table-contrac.component.html',
	styleUrls: ['./table-contrac.component.scss'],
})
export class TableContracComponent implements OnInit {
	catContracts: ICContrAndCCompDTO[] = [];
	contracts: IContracEdit[] = [];
	catComps: ICatComp[] = [];

	constructor(
		/** Servicio de categorias contractuales */
		private readonly catContractService: CatContractService,
		/** Servicio de categorias competenciales */
		private readonly cCompSv: CatCompetencialesService,
		private readonly logger: LogService,
	) {}

	alert(msg: string) {
		alert(msg);
	}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente table-contrac');
		const promises = await Promise.all([this.updateContrView(), this.cCompSv.getAll()]);
		this.catComps = promises[1];
	}

	async updateContrView(): Promise<void> {
		this.logger.verbose('Actualizando vista de catContractuales');
		this.catContracts = await this.catContractService.getAll();
	}

	updateCContr(cContr: ICContrAndCCompDTO) {
		this.logger.debug(`Actualizando datos de la cContr con ID: ${cContr.id}`, cContr);
		this.catContractService.update(cContr);
	}

	deleteCContr(catContract: ICatContr): boolean {
		this.catContractService.delete(catContract.id);
		this.logger.debug(`Eliminando la catContrac con ID: ${catContract.id}`);
		return true;
	}
}
