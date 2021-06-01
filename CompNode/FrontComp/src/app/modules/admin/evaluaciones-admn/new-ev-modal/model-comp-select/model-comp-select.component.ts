import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';

type CompetenciaCtrlView = {
	/** //TODO: Tsdoc  */
	competencias: ICompetencia[];
	/** //TODO: Tsdoc  */
	compSelected: ICompetencia[];
};

@Component({
	selector: 'app-model-comp-select [catCompObs]',
	templateUrl: './model-comp-select.component.html',
	styleUrls: ['./model-comp-select.component.scss'],
})
export class ModelCompSelectComponent implements OnInit {
	@Input() catCompObs!: BehaviorSubject<ICatComp | undefined>;
	//TODO: Tsdoc
	modelReferenceShow!: IRefModel;
	//TODO: Tsdoc

	compsObs = new BehaviorSubject<ICompetencia[]>([]);

	competCtl: CompetenciaCtrlView = {
		competencias: [],
		compSelected: [],
	};

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		if (!this.catCompObs.value)
			throw new Error('Has renderizado el componente antes de elegir la catComp, o esta es undefined');
		this.catCompObs.subscribe(async cComp => {
			this.modelReferenceShow = await this.evModelSv.getOneReference(cComp!.id);
			this.competCtl.competencias = this.getCompetsOfModel(this.modelReferenceShow);
			this.competCtl.compSelected = [];
			this.compsObs.next([]);
		});
	}
	//TODO: Tsdoc
	getCompetsOfModel = getCompetOfModel;

	/**
	 * A copy of the reference model is stored, submodels are searched with that/those competence/cies id
	 * and returns those that DO NOT match
	 *
	 * @param competencias the competence or competencies that you want to look for in the subModel
	 */
	getCompetsNotMatch(competencias: ICompetencia[]) {
		const modelToSend = { ...this.modelReferenceShow };
		modelToSend.subModels = modelToSend.subModels.filter(subModel => {
			return !competencias.find(comp => comp.id === subModel.competencia.id);
		});
		return modelToSend;
	}

	/**
	 * Used for select the competence or competencies for the current evaluation
	 *
	 * @param comp the competence you want to add or remove to the array
	 */
	toggleCompet(comp: ICompetencia) {
		const arrToPush = this.competCtl.compSelected;
		const index = arrToPush.indexOf(comp);
		if (index == -1) {
			arrToPush.push(comp);
			console.log(arrToPush);
		} else {
			arrToPush.splice(index, 1);
			console.log(arrToPush);
		}
	}
	//TODO: tsdoc
	setCompe(): void {
		this.compsObs.next(this.competCtl.compSelected);
	}
}
