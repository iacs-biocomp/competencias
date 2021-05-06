import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICatComp } from 'sharedInterfaces/ICategorias';
import { IEvaluacion, IEvModel } from 'sharedInterfaces/IEvaluaciones';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

/** Componente destinado a la creación de una nueva evaluación, modal de bootstrap */
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
	periodos = {
		rangePropuesta: new FormGroup({
			start: new FormControl(),
			end: new FormControl(),
		}),
		rangeValidacion: new FormGroup({
			start: new FormControl(),
			end: new FormControl(),
		}),
		rangeValoracion: new FormGroup({
			start: new FormControl(),
			end: new FormControl(),
		}),
		rangeEvaluacion: new FormGroup({
			start: new FormControl(),
			end: new FormControl(),
		}),
	};

	constructor(private evSv: EvaluacionesAdmService, private cCompSv: CatCompetencialesService) {}
	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([this.cCompSv.getAll(), this.evSv.getAllEvModels()]);
		this.catComps = promises[0].sort((a, b) => a.id.localeCompare(b.id));
		this.evModels = promises[1];
	}

	/**
	 * Filtra de this.evModels y elimina los que no tengan una catComp igual a this.catCompSelected
	 * Devuelve [] en caso de que este undefined cualquiera de estos dos.
	 * @returns El array de modelos de evaluaciones filtrado
	 */
	filterEvModels(): IEvModel[] {
		if (!this.catCompSelected || !this.evModels) {
			return [];
		}
		return this.evModels.filter(evModel => evModel.catComp?.id == this.catCompSelected?.id);
	}

	save() {
		this.evToAdd = {
			id: 'none',
			description: 'test',
			catComp: this.catCompSelected!,
			model: this.evModelSelected,
			iniDate: this.periodos.rangePropuesta.get('start')!.value as Date,
			finPropuestas: this.periodos.rangePropuesta.get('end')!.value as Date,
			iniValidacion: this.periodos.rangeValidacion.get('start')!.value as Date,
			endValidacion: this.periodos.rangeValidacion.get('end')!.value as Date,
			iniValoracion: this.periodos.rangeValoracion.get('start')!.value as Date,
			endValoracion: this.periodos.rangeValoracion.get('end')!.value as Date,
			iniPerEvaluado: this.periodos.rangeEvaluacion.get('start')!.value as Date,
			endPerEvaluado: this.periodos.rangeEvaluacion.get('end')!.value as Date,
		};
		console.log(this.evToAdd);
		this.evSv.save(this.evToAdd);
	}
}
