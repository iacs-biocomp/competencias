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

	alert(msg: string) {
		alert(msg);
	}

	async ngOnInit(): Promise<void> {
		await this.updateContrView();
		this.catComps = await this.cCompSv.getAll();
	}

	async updateContrView(): Promise<void> {
		this.catContracts = await this.catContractService.getAll();
	}

	updateCContr(cContr: ICatContr) {
		this.catContractService.update(cContr);
	}

	deleteCContr(catContract: ICatContr): boolean {
		this.catContractService.delete(catContract.id);
		return true;
	}
}
