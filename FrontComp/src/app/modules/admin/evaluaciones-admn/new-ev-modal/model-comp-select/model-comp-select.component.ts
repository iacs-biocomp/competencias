import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia } from 'sharedInterfaces/Entity';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';

type CompetenciaCtrlView = {
	/** Array with all the competences */
	competencias: ICompetencia[];
	/** Array with the competences selected */
	compsSelected: ICompetencia[];
};

@Component({
	selector: 'app-model-comp-select [catCompObs]',
	templateUrl: './model-comp-select.component.html',
	styleUrls: ['./model-comp-select.component.scss'],
})
export class ModelCompSelectComponent implements OnInit {
	/** Receives the catComp selected to creates the evaluation */
	@Input() catCompObs!: BehaviorSubject<ICatComp | undefined>;
	/** Send and array of competences selected */
	@Output() compsEmitter = new EventEmitter<ICompetencia[]>();

	/** Imports a model reference (id, catComp, subModels[]) */
	modelReferenceShow!: IRefModel;

	/** Observer with the competences[] selected */
	compsObs = new BehaviorSubject<ICompetencia[]>([]);

	competCtl: CompetenciaCtrlView = {
		/** Array with all the current competences */
		competencias: [],
		/** Array with the competences selected */
		compsSelected: [],
	};

	/** Gets the competences of a specify model, this function is in Utility.ts */
	getCompetsOfModel = getCompetOfModel;

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		if (!this.catCompObs.value) {
			throw new Error('Has renderizado el componente antes de elegir la catComp, o esta es undefined');
		}
		this.catCompObs.subscribe(async cComp => {
			//Gets the modelReference with the Ccomp.id that we want to search in evModel
			this.modelReferenceShow = await this.evModelSv.getOneReference(cComp!.id);
			//Gets the competences of this modelReference and save it in competCtl.competencias array
			this.competCtl.competencias = this.getCompetsOfModel(this.modelReferenceShow);
			this.flushCachedData();
		});
	}

	/** Deletes both cached data, the compsSelected and the compsObs, so, if one of these changed, its flushed */
	flushCachedData(): void {
		this.competCtl.compsSelected = [];
		this.compsObs.next([]);
	}


	/**
	 * Used for select the competence or competencies for the current evaluation
	 *
	 * @param comp the competence you want to add or remove to the array (compsSelected)
	 */
	toggleCompet(comp: ICompetencia): void {
	// TODO: [10]{N1} Refactor, usar toggle inArray
		const arrToPush = this.competCtl.compsSelected;
		const index = arrToPush.indexOf(comp);
		if (index == -1) {
			arrToPush.push(comp);
		} else {
			arrToPush.splice(index, 1);
		}
	}
	/** Sets the competencies selected to the observer */
	setCompe(): void {
		this.compsObs.next(this.competCtl.compsSelected);
	}
}
