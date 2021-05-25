import { Component, OnInit, Input } from '@angular/core';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia } from 'sharedInterfaces/Entity';
import { EvModelsAdmnService } from '../../services/ev-models-admn.service';

@Component({
	selector: 'app-model-comp-select',
	templateUrl: './model-comp-select.component.html',
	styleUrls: ['./model-comp-select.component.css'],
})
export class ModelCompSelectComponent implements OnInit {
	@Input() catComp!: ICatComp;
	//TODO: Tsdoc
	modelReferenceShow!: IRefModel;
	//TODO: Tsdoc
	competenciasModelo: ICompetencia[] = [];

	constructor(private evModelSv: EvModelsAdmnService) {}

	async ngOnInit(): Promise<void> {
		if (!this.catComp)
			throw new Error('Has renderizado el componente antes de mandarle la catComp o esta es undefined');
		this.modelReferenceShow = await this.evModelSv.getOneReference(this.catComp.id);
		this.competenciasModelo = this.getCompetsOfModel(this.modelReferenceShow);
		console.log(this.dsadas([{ id: "C9'", descripcion: 'ddassa' }]));
	}
	//TODO: Tsdoc
	getCompetsOfModel(model: IRefModel): ICompetencia[] {
		const competenciasRepetidas = model.subModels.map(subModel => {
			return subModel.competencia;
		});
		console.log(competenciasRepetidas);
		return competenciasRepetidas.filter(
			(compet, index) => competenciasRepetidas.findIndex(f => compet.id === f.id) === index,
		);
	}
	//TODO: Tsdoc y cambiar nombre
	dsadas(competencias: ICompetencia[]) {
		const modelToSend = { ...this.modelReferenceShow };
		modelToSend.subModels = modelToSend.subModels.filter(subModel => {
			return !competencias.find(comp => comp.id === subModel.competencia.id);
		});
		return modelToSend;
	}
}
