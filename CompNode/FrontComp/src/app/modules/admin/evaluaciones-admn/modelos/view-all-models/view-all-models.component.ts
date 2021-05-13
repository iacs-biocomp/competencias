import { Component, OnInit } from '@angular/core';
import { IRefModel } from 'sharedInterfaces/DTO';
import { CatCompetencialesService } from '../../../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../../../competencias-admin/services/competencias.service';
import { ComportService } from '../../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../../niveles-admin/services/nivel.service';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';
import { DbData } from '../new-ev-model.component';

type ViewProps = {
	/** Representa si hay modelos de referencia o no */
	haveModels: boolean;
};
@Component({
	selector: 'app-view-all-models',
	templateUrl: './view-all-models.component.html',
	styleUrls: ['./view-all-models.component.css'],
})
export class ViewAllModelsComponent implements OnInit {
	renderViewModels: boolean = false;
	refModels: IRefModel[] = [];
	modoEdicion: boolean = false;
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
		},
	};
	/** Objeto con propiedades usadas principalmente en la vista */
	viewProps?: ViewProps;
	constructor(
		private evModelSv: EvModelsAdmnService,
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
	) {}

	async ngOnInit(): Promise<void> {
		console.log('start on init edit');
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAll(),
			this.nivSv.getAll(),
			this.comportSv.getAll(),
		]);
		this.dbData.catComps = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.dbData.comports = promises[3];
		this.refModels = await this.evModelSv.getAllReference();

		this.viewProps = {
			haveModels: this.refModels.length !== 0,
		};
		if (!this.viewProps) throw new Error('View Props no ha sido inicializado');
		console.log(this);
	}
}
