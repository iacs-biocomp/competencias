import { Component, OnInit } from '@angular/core';
import { ICatComp } from 'sharedInterfaces/ICategorias';
import { IEvaluacion, IEvModel } from 'sharedInterfaces/IEvaluaciones';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

@Component({
	selector: 'app-new-ev-modal',
	templateUrl: './new-ev-modal.component.html',
	styleUrls: ['./new-ev-modal.component.css'],
})
export class NewEvModalComponent implements OnInit {
	evModels!: IEvModel[];
	// evModelsFiltered: IEvModel[] = [];
	catComps!: ICatComp[];
	catCompSelected?: ICatComp;
	evToAdd!: IEvaluacion;
	evModelSelected!: IEvModel;
	constructor(private evSv: EvaluacionesAdmService, private cCompSv: CatCompetencialesService) {}
	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([this.cCompSv.getAll(), this.evSv.getAllEvModels()]);
		this.catComps = promises[0].sort((a, b) => a.id.localeCompare(b.id));
		this.evModels = promises[1];
	}
	//TODO: Añadir tsdoc y dateRangePicker con angular material
	filterEvModels(): IEvModel[] {
		if (!this.catCompSelected || !this.evModels) {
			return [];
		}
		return this.evModels.filter(evModel => evModel.catComp?.id == this.catCompSelected?.id);
	}
	save() {
		console.log(this.evModelSelected);
		this.evToAdd = {
			id: -1,
			description: 'test',
			catComp: this.catCompSelected!,
			model: this.evModelSelected,
		};
		this.evSv.save(this.evToAdd);
	}
}
