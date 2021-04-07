import { Component, OnInit } from '@angular/core';
import { ICatContr } from '../../../../../../../interfaces/ICategorias';
import { CatContractService } from '../services/CatContractuales.service';

@Component({
	selector: 'app-table-contrac',
	templateUrl: './table-contrac.component.html',
	styleUrls: ['./table-contrac.component.css'],
})
export class TableContracComponent implements OnInit {
	constructor(private catContractService: CatContractService) {}
	catContracts: ICatContr[] = [];

	ngOnInit(): void {}
	canDelete(catContract: ICatContr): boolean {
		return true;
	}

	deleteCatContract(catContract: ICatContr): boolean {
		this.catContractService.delCatContract(catContract.id);
		return true;
	}
}
