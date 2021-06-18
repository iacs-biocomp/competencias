import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { NivelService } from '../../../niveles-admin/services/nivel.service';

/** Tipo formado por una competencia y su nivel asociado */
export type CompAndNiv = { comp: ICompetencia; niv: INivel };
/** Config type for the component itself */
type cConfig = {
	/** Title modelNiv */
	title: string;
};

/**
 * Componente que muestra una lista de competencias y al lado un desplegable para selecionar un nivel
 */
@Component({
	selector: 'app-obj-nivs-select [idModal] [compsObs]',
	templateUrl: './obj-niveles-select.component.html',
	styleUrls: ['./obj-niveles-select.component.scss'],
})
export class ObjectiveNivsSelectComponent implements OnInit {
	/** Receives an array with the competencies selected to the evaluation */
	@Input() compsObs!: BehaviorSubject<ICompetencia[]>;
	/** Receives an array with the levels to show next to each competence */
	@Input() nivsObs!: BehaviorSubject<INivel[]>;
	/** Emits array of {@link CompAndNiv} (objective level paired to a comp) */
	@Output('onSaved') compAndNivEmitter = new EventEmitter<CompAndNiv[]>();
	/** The identifier used for toggle the modal */
	@Input() idModal = '';
	@Input() cConfig: cConfig = {
		title: 'Default title',
	};

	/**
	 * Array que almacena todos lo niveles actuales
	 * @deprecated Usar el observable de niveles como input del componente
	 */
	nivs: INivel[] = [];
	// TODO: Tsdoc explicativo
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

	/**
	 * Saves the objective level with their competence
	 *
	 * @param comp Competence with which the objective level is associated
	 * @param niv The objective level or its code (NOT id) that will be associated with the competence
	 * @throws Error if objective level is not valid
	 */
	setNivel(comp: ICompetencia, niv: INivel | string): void {
		const nivId = typeof niv === 'string' ? niv : niv.code;
		const nivObj = this.nivs.find(n => n.code === nivId);
		if (!nivObj) {
			throw new Error('Nivel objetivo no valido, codigo u objeto incorrecto');
		}
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
