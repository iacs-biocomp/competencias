import { Component, OnInit } from '@angular/core';
import { ICatComp, ICatContr } from '../../../../../../../interfaces/ICategorias';
import { CatCompetencialesService } from '../services/CatCompetenciales.service';
import { CatContractService } from '../services/CatContractuales.service';

interface IContracEdit extends ICatContr {
	editing?: boolean;
}
@Component({
	selector: 'app-table-contrac',
	templateUrl: './table-contrac.component.html',
	styleUrls: ['./table-contrac.component.css'],
})
export class TableContracComponent implements OnInit {
	constructor(
		/** Servicio de categorias contractuales */
		private catContractService: CatContractService,
		/** Servicio de categorias competenciales */
		private cCompSv: CatCompetencialesService,
	) {}
	catContracts: ICatContr[] = [];
	contracts: IContracEdit[] = [];
	catComps: ICatComp[] = [];

	async ngOnInit(): Promise<void> {
		await this.updateContractView();
		this.catComps = await this.cCompSv.getAllCatComp();
		console.log(this.catComps);

		// setInterval(() => {
		// 	console.log(this.catContracts);
		// }, 3500);
	}

	async updateContractView(): Promise<void> {
		this.catContracts = await this.catContractService.getAllCatContract();
		console.log(this.contracts);
	}

	canDelete(catContract: ICatContr): boolean {
		return false;
	}

	deleteCatContract(catContract: ICatContr): boolean {
		this.catContractService.delCatContract(catContract.id);
		return true;
	}
}
