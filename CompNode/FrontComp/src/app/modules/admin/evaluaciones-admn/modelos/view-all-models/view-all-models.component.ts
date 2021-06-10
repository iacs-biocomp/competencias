import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRefModel } from 'sharedInterfaces/DTO';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';
import { DbData } from '../new-ev-model.component';

type ViewProps = {
	/** Representa si hay modelos de referencia o no */
	haveModels: boolean;
};
/**
 * TODO: Comentario de que hace este componente
 */
@Component({
	selector: 'app-view-all-models',
	templateUrl: './view-all-models.component.html',
	styleUrls: ['./view-all-models.component.scss'],
})
export class ViewAllModelsComponent implements OnInit {
	renderViewModels = false;
	refModels: IRefModel[] = [];
	modoEdicion = false;
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
	evModelToShow = new BehaviorSubject<IRefModel | undefined>(undefined);

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		this.refModels = await this.evModelSv.getAllReference();

		this.viewProps = {
			haveModels: this.refModels.length !== 0,
		};
		if (!this.viewProps) {
			throw new Error('View Props no ha sido inicializado');
		}
		console.log(this);
	}
	evModelShowNotUndefined(subj: BehaviorSubject<IRefModel | undefined>): BehaviorSubject<IRefModel> {
		if (!subj.value) {
			throw new Error(
				'Se ha llamado a la función de casteo cuando BehaviorSubject tenia valor interno undefined',
			);
		}
		return subj as BehaviorSubject<IRefModel>;
	}
// TODO: tsdoc /
	newEvModelShow(model: IRefModel): BehaviorSubject<IRefModel> {
		console.log(this.evModelToShow);
		return new BehaviorSubject<IRefModel>(model);
	}
}
