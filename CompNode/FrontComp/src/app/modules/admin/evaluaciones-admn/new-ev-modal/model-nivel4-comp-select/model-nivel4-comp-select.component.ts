import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../../../niveles-admin/services/nivel.service';

@Component({
	selector: 'app-model-nivel4-comp-select',
	templateUrl: './model-nivel4-comp-select.component.html',
	styleUrls: ['./model-nivel4-comp-select.component.scss'],
})
export class ModelNivel4CompSelectComponent implements OnInit {
	@Input() compsObs!: BehaviorSubject<ICompetencia[]>;

	niveles: INivel[] = [];
	refModel!: IRefModel;
	nivelObs = new BehaviorSubject<INivel | undefined>(undefined);

	competenciasModelo!: ICompetencia[];

	constructor(private nivelSv: NivelService) {}

	async ngOnInit(): Promise<void> {
		this.niveles = await this.nivelSv.getAllRefNivs();
		this.compsObs.subscribe(x => console.log(x));
	}

	/** Method that save all the info evaluation and creates it*/
	saveDataEval() {}

	setNivel(idNivel: number): void {
		const nivelToSet = this.niveles.find(nivel => nivel.id === idNivel);
		this.nivelObs.next(nivelToSet);
	}
}
