import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../../../niveles-admin/services/nivel.service';

//TODO: Change name
export type CompYnivel = { comp: ICompetencia; niv: INivel };
@Component({
	selector: 'app-model-nivel4-comp-select',
	templateUrl: './model-nivel4-comp-select.component.html',
	styleUrls: ['./model-nivel4-comp-select.component.scss'],
})
export class ModelNivel4CompSelectComponent implements OnInit {
	@Input() compsObs!: BehaviorSubject<ICompetencia[]>;
	@Output() nivelClick = new EventEmitter<CompYnivel[]>();

	niveles: INivel[] = [];
	refModel!: IRefModel;
	bufferCosas: Partial<CompYnivel>[] = [];

	competenciasModelo!: ICompetencia[];

	constructor(private nivelSv: NivelService) {}
	//TODO: Change names
	async ngOnInit(): Promise<void> {
		this.niveles = await this.nivelSv.getAllRefNivs();
		this.compsObs.subscribe(comps => {
			console.log(comps);
			const aMeter = comps.map(c => ({ comp: c })) as Partial<CompYnivel>[];
			this.bufferCosas = aMeter;
		});
	}
	//TODO: Change names
	setNivel(comp: ICompetencia, niv: string): void {
		const nivObj = this.niveles.find(n => n.code === niv);
		const indx = this.bufferCosas.findIndex(cosa => cosa.comp?.id === comp.id);
		this.bufferCosas[indx].niv = nivObj;
	}
	//TODO: Change names
	nivelClicked(): void {
		const cosasAMandar = this.bufferCosas.filter(cosa =>
			!cosa.comp && !cosa.niv ? false : true,
		) as CompYnivel[];
		this.nivelClick.emit(cosasAMandar);
	}
}
