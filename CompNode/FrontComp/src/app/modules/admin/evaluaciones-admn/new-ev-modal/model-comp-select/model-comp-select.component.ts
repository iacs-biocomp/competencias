import { Component, OnInit, Input } from '@angular/core';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia } from 'sharedInterfaces/Entity';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';

type CompetenciaCtrlView = {
	competenciasModelos: ICompetencia[];
	competenciasRepetidas: ICompetencia[];
};

@Component({
	selector: 'app-model-comp-select',
	templateUrl: './model-comp-select.component.html',
	styleUrls: ['./model-comp-select.component.scss'],
})
export class ModelCompSelectComponent implements OnInit {
	@Input() catComp!: ICatComp;
	//TODO: Tsdoc
	modelReferenceShow!: IRefModel;
	//TODO: Tsdoc

	competCtl: CompetenciaCtrlView = {
		competenciasModelos: [],
		competenciasRepetidas: [],
	};

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		if (!this.catComp)
			throw new Error('Has renderizado el componente antes de mandarle la catComp o esta es undefined');
		this.modelReferenceShow = await this.evModelSv.getOneReference(this.catComp.id);
		this.competCtl.competenciasModelos = this.getCompetsOfModel(this.modelReferenceShow);
	//	console.log(this.getCompetsNotSelected([{ id: "C9'", descripcion: 'ddassa' }]));
	}
	//TODO: Tsdoc
	getCompetsOfModel(model: IRefModel): ICompetencia[] {
		this.competCtl.competenciasRepetidas = model.subModels.map(subModel => {
			return subModel.competencia;
		});
	//	console.log(this.competCtl.competenciasModelos);
		return this.competCtl.competenciasModelos.filter(
			(compet, index) => this.competCtl.competenciasModelos.findIndex(f => compet.id === f.id) === index,
		);
	}
	/**
	 * A copy of the reference model is stored, submodels are searched with that/those competence/cies id
	 * and returns those that DO NOT match
	 *
	 * @param competencias the competence/ or competencies that you want to look for in the subModel
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
		const arrToPush = this.competCtl.competenciasModelos;
		const index = this.competCtl.competenciasModelos.indexOf(comp);
		if (index == -1){
			arrToPush.push(comp);
			console.log(this.competCtl.competenciasModelos);
		} else {
			arrToPush.splice(index, 1);
			console.log(this.competCtl.competenciasModelos);
		}
//		console.log(this.competCtl.competenciasModelos);
	}
}
