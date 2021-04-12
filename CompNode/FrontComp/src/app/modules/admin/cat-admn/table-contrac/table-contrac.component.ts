import { Component, OnInit } from '@angular/core';
import { ICatContr } from '../../../../../../../interfaces/ICategorias';
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
	constructor(private catContractService: CatContractService) {}
	catContracts: ICatContr[] = [];
	contracts: IContracEdit[] = [];

	async ngOnInit(): Promise<void> {
		await this.updateContractView();
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
