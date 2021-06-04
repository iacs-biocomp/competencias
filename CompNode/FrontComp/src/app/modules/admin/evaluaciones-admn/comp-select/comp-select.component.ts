import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getCompetOfModel, toggleInArray } from 'sharedCode/Utility';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';

type CompetenciaCtrlView = {
	/** Array with the selected competences, type ICompetencia*/
	compSelected: ICompetencia[];
};

@Component({
	selector: 'app-comp-select-modal [compsObs] [idModal]',
	templateUrl: './comp-select.component.html',
	styleUrls: ['./comp-select.component.scss'],
})
export class CompSelectComponent implements OnInit, OnDestroy {
	@Input() compsObs = new BehaviorSubject<ICompetencia[]>([]);
	@Input() preSelectedComps?: ICompetencia[];
	@Input() idModal!: string;
	@Output('onModalFinish') finishEmitter = new EventEmitter<ICompetencia[]>();

	//TODO: Tsdoc
	modelReferenceShow!: IRefModel;

	//TODO: Tsdoc
	competCtl: CompetenciaCtrlView = {
		compSelected: [],
	};
	subs: Subscription[] = [];

	constructor() {
		//w
	}

	async ngOnInit(): Promise<void> {
		if (!this.compsObs.value) {
			throw new Error('Has renderizado el componente antes de elegir las competencias, o esta es undefined');
		}
		this.subs.push(
			this.compsObs.subscribe(() => {
				this.preSelectedComps = !this.preSelectedComps ? [] : this.preSelectedComps; //Se quita undefined
				this.competCtl.compSelected = this.preSelectedComps;
			}),
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	getCompetsOfModel = getCompetOfModel;

	/**
	 * A copy of the reference model is stored, submodels are searched with that/those competence/cies id
	 * and returns those that DO NOT match
	 *
	 * @param competencias the competence or competencies that you want to look for in the subModel
	 */
	getCompetsNotMatch(competencias: ICompetencia[]) {
		const modelToSend = { ...this.modelReferenceShow };
		modelToSend.subModels = modelToSend.subModels.filter(
			subModel => !competencias.find(comp => comp.id === subModel.competencia.id),
		);
		return modelToSend;
	}
	//TODO: tsdoc
	toggleComp(comp: ICompetencia) {
		toggleInArray<ICompetencia>(comp, this.competCtl.compSelected);
	}

	submit(): void {
		this.finishEmitter.emit(this.competCtl.compSelected);
		this.competCtl.compSelected = [];
	}
}
