import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { DbData } from 'src/app/types/data';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';

type ViewProps = {
	/** Representa si hay modelos de referencia o no */
	haveModels: boolean;
};

type DbDataViewAllM = DbData & {
	modelToAdd: Omit<IRefModel, 'id' | 'catComp'> & { catComp: ICatComp | undefined };
};
/**
 * Componente para ver todos los modelos creados y su informacion
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
	dbData: DbDataViewAllM = {
		cComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
			reference: true,
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
}
