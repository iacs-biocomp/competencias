import { Component, OnInit } from '@angular/core';
import { CatContractService, CatCompetencialesService } from 'services/data';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr, ICatComp } from 'sharedInterfaces/Entity';
import { RemovePropsInU, RequiredAndNotNull } from 'sharedInterfaces/Utility';
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
	cContrsToAdd: ICContrAddDTO[] = [];

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

	addEmptyCContr(): void {
		this.logger.verbose('Añadiendo cContr vacia a cContrsToAdd');
		this.cContrsToAdd.push({
			id: '',
			description: '',
		});
	}

	async persistCContr(cContr: ICContrAddDTO): Promise<void> {
		if (this.canPersistCContr(cContr)) {
			const isSaved = await this.catContractService.add(cContr);
			if (isSaved) {
				// TODO: Use lodash instead splice and findIndex
				this.cContrsToAdd.splice(
					this.cContrsToAdd.findIndex(cContrAdd => cContr.id === cContrAdd.id),
					1,
				);
				this.catContracts.push({
					...cContr,
					catComp: {} as RemovePropsInU<RequiredAndNotNull<ICatComp>, object>,
				});
			}
		} else {
			this.logger.error('Error en la vista, no ha sido controlado si una cContr se puede añadir');
		}
	}

	deleteCatCompToAdd(cContrToDelete: { id: string }): void {
		// TODO: Use lodash instead splice and findIndex
		this.cContrsToAdd.splice(
			this.cContrsToAdd.findIndex(cContr => cContr.id === cContrToDelete.id),
			1,
		);
	}

	canPersistCContr(cContr: { id: string; description: string }): boolean {
		return cContr.description !== '' && cContr.id !== '';
	}
}
