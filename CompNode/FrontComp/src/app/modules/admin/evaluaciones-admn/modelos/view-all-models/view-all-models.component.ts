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
	//TODO: Complete, este subject al pasarselo al componente es undefined (No el valor sino el propio objeto)
	evModelToShow = new BehaviorSubject<IRefModel | undefined>(undefined);

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		this.refModels = await this.evModelSv.getAllReference();

		this.viewProps = {
			haveModels: this.refModels.length !== 0,
		};
		if (!this.viewProps) throw new Error('View Props no ha sido inicializado');
		console.log(this);
	}

	newEvModelShow(model: IRefModel): BehaviorSubject<IRefModel> {
		console.log(this.evModelToShow);
		return new BehaviorSubject<IRefModel>(model);
	}
}
