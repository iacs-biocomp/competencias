import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../../../niveles-admin/services/nivel.service';

/** Tipo formado por una competencia y su nivel asociado */
export type CompAndNiv = { comp: ICompetencia; niv: INivel };
export type cConfigModelNivel4 = {
	/** Title modelNiv */
	title: string;
}
@Component({
	selector: 'app-model-nivel4-comp-select [idModal] [compsObs]',
	templateUrl: './model-nivel4-comp-select.component.html',
	styleUrls: ['./model-nivel4-comp-select.component.scss'],
})
export class ModelNivel4CompSelectComponent implements OnInit {
	/** Receives an array with the competencies selected to the evaluation */
	@Input() compsObs!: BehaviorSubject<ICompetencia[]>;
	/** Sends an object made up of the selected level and its competence */
	@Output('onSaved') compAndNivEmitter = new EventEmitter<CompAndNiv[]>();
	@Input()idModal = '';
	@Input()cConfig: cConfigModelNivel4 = {
		title: 'Default title'
	};

	/** Array que almacena todos lo niveles actuales */
	nivs: INivel[] = [];
	/** CompAndNiv[](comp, niv) partial  */
	bufferCompNiv: Partial<CompAndNiv>[] = [];

	constructor(private nivelSv: NivelService) {}

	async ngOnInit(): Promise<void> {
		this.nivs = await this.nivelSv.getAllRefNivs(); // Se guardan en la var niveles los niveles de referencia
			this.compsObs.subscribe(comps => {
			const compToSave = comps.map(c => ({ comp: c })) as Partial<CompAndNiv>[]; //Map the coompetences and saves it in compToSave
			this.bufferCompNiv = compToSave;
		});
	}
	/** Saves the level objetivo if they find it, with their competence */
	setNivel(comp: ICompetencia, niv: string): void {
		const nivObj = this.nivs.find(n => n.code === niv); //busca si hay un nivel con ese codigo (string)
		const indx = this.bufferCompNiv.findIndex(cn => cn.comp?.id === comp.id);
		this.bufferCompNiv[indx].niv = nivObj;
	}
	/** Creates the object type CompAndNiv[comp,niv] and emits it */
	nivelClicked(): void {
		const objCompNivel = this.bufferCompNiv.filter(objToCreate =>
			!objToCreate.comp && !objToCreate.niv ? false : true,
		) as CompAndNiv[]; // creates the object if is true
		this.compAndNivEmitter.emit(objCompNivel); //emit the object to the parent
	}
}
