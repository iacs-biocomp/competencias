import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia, IEvModel, INivel } from 'sharedInterfaces/Entity';
import { RequiredAndNotNull } from 'sharedInterfaces/Utility';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';
import { CompYnivel } from '../model-nivel4-comp-select/model-nivel4-comp-select.component';
import { IEvSendDTO } from '../../../../../../../../sharedCode/interfaces/DTO/IEvaluacionesDTO'

type CompetenciaCtrlView = {
	/** Array with all the competences, type ICompetencia  */
	competencias: ICompetencia[];
	/** Array with the selected competences, type ICompetencia*/
	compSelected: ICompetencia[];
};



@Component({
	selector: 'app-model-comp-select [catCompObs]',
	templateUrl: './model-comp-select.component.html',
	styleUrls: ['./model-comp-select.component.scss'],
})
export class ModelCompSelectComponent implements OnInit {
	@Input() catCompObs!: BehaviorSubject<ICatComp | undefined>;
	@Output() miEmitter = new EventEmitter<ds>();

	//TODO: Tsdoc
	modelReferenceShow!: IRefModel;
	//TODO: Tsdoc

	enviarData!: CompYnivel[];


	//TODO: tsdoc
	compsObs = new BehaviorSubject<ICompetencia[]>([]);

	competCtl: CompetenciaCtrlView = {
		competencias: [],
		compSelected: [],
	};

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
	/** Gets the competences of a specify model, this function is in Utility.ts */
	getCompetsOfModel = getCompetOfModel;

	/**
	 * A copy of the reference model is stored, submodels are searched with that/those competence/cies id
	 * and returns those that match
	 *
	 * @param competencias the competence or competencies that you want to look for in the subModel
	 */
	getCompetsNotMatch(competencias: ICompetencia[]): RequiredAndNotNull<IEvModel> {
		const modelToSend = { ...this.modelReferenceShow } as RequiredAndNotNull<IEvModel>;
		modelToSend.subModels = modelToSend.subModels.filter(subModel => {
			return !!competencias.find(comp => comp.id === subModel.competencia.id) ? true : false;
		});

		return modelToSend;
	}

	/** Deletes both cached data, the compSelected and the compsObs, so, if one of these changed, its flushed */
	flushCachedData(): void {
		this.competCtl.compSelected = [];
		this.compsObs.next([]);
	}

	/**
	 * Used for select the competence or competencies for the current evaluation
	 *
	 * @param comp the competence you want to add or remove to the array (compSelected)
	 */
	toggleCompet(comp: ICompetencia): void {
		const arrToPush = this.competCtl.compSelected;
		const index = arrToPush.indexOf(comp);
		if (index == -1) {
			arrToPush.push(comp);

		} else {
			arrToPush.splice(index, 1);

		}
	}
	//TODO: tsdoc
	setCompe(): void {
		this.compsObs.next(this.competCtl.compSelected);
	}

	onChildNivelClicked(event: CompYnivel[]): void {
		const modelToSend = this.getCompetsNotMatch(this.competCtl.compSelected);
		const obj: ds= {a: modelToSend, b: event};
	  this.miEmitter.emit(obj);

	}

}
export type ds=  {
	a: RequiredAndNotNull<IEvModel>;
	b: CompYnivel[];
}
