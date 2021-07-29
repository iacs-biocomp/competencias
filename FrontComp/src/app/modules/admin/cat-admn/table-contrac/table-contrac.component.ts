import { Component, OnInit } from '@angular/core';
import { ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr, ICatComp } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../services/CatCompetenciales.service';
import { CatContractService } from '../services/CatContractuales.service';

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
		private catContractService: CatContractService,
		/** Servicio de categorias competenciales */
		private cCompSv: CatCompetencialesService,
	) {}

	alert(msg: string) {
		alert(msg);
	}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([this.updateContrView(), this.cCompSv.getAll()]);
		this.catComps = promises[1];
	}

	async updateContrView(): Promise<void> {
		this.catContracts = await this.catContractService.getAll();
	}

	updateCContr(cContr: ICContrAndCCompDTO) {
		this.catContractService.update(cContr);
	}

	deleteCContr(catContract: ICatContr): boolean {
		this.catContractService.delete(catContract.id);
		return true;
	}
}
