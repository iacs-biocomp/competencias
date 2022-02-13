import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	ViewChild,
	ElementRef,
	EventEmitter,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

/** Tipo formado por una competencia y su nivel asociado */
export type CompAndNiv = { comp: ICompetencia; niv: INivel };

type CompAndOptNiv = Pick<CompAndNiv, 'comp'> & Partial<CompAndNiv>;

/** Config type for the component itself */
export type cConfig = {
	/** Title modelNiv */
	title: string;
};

/**
 * Componente que muestra una lista de competencias y al lado un desplegable para selecionar un nivel
 */
@Component({
	selector: 'app-obj-nivs-select [idModal] [compsObs] [referenceLevels]',
	templateUrl: './obj-niveles-select.component.html',
	styleUrls: ['./obj-niveles-select.component.scss'],
})
export class ObjectiveNivsSelectComponent implements OnInit, OnDestroy {
	/** Receives an array with the competencies selected to the evaluation */
	@Input() compsObs!: BehaviorSubject<ICompetencia[]>;
	/** Receives an array with the levels to show next to each competence */
	@Input() referenceLevels: INivel[] = [];
	/** Emits array of {@link CompAndNiv} (objective level paired to a comp) */
	@Output('onSaved') compAndNivEmitter = new EventEmitter<CompAndNiv[]>();
	/** The identifier used for toggle the modal */
	@Input() idModal = '';
	@Input() cConfig: cConfig = {
		title: 'Default title',
	};
	/** Ref to button that closes the modal */
	@ViewChild('closeModal') closeModalBtn!: ElementRef<HTMLButtonElement>;
	/** Array that should have all component's subscriptions */
	#subs: Subscription[] = [];

	/**
	 * partial(propiedades en opcional) de objeto compAndNiv (comp, niv)
	 */
	bufferCompNiv: CompAndOptNiv[] = [];

	constructor(private readonly logger: LogService) {}

	ngOnInit(): void {
		this.logger.verbose(`Executing ngOnInit ${this.constructor.name}`);
		this.#subs.push(
			this.compsObs.subscribe(comps => {
				this.bufferCompNiv = comps.map<CompAndOptNiv>(c => ({ comp: c })); //Map the coompetences and saves it in compToSave
			}),
		);
	}

	ngOnDestroy(): void {
		this.logger.verbose(`Executing ngOnDestroy of ${this.constructor.name} `);
		this.#subs.forEach(s => s.unsubscribe());
		this.closeModalBtn.nativeElement.click();
	}

	/**
	 * Saves the objective level with their competence
	 *
	 * @param compId Competence with which the objective level is associated
	 * @param nivId The objective level or its code (NOT id) that will be associated with the competence
	 * @throws Error if objective level is not valid
	 */
	setNivel(compId: ICompetencia['id'], nivId: INivel['code']): void {
		const nivObj = this.referenceLevels.find(n => n.code === nivId);
		const indx = this.bufferCompNiv.findIndex(cn => cn.comp.id === compId);
		if (!nivObj) {
			throw new Error('Nivel objetivo no valido, codigo u objeto incorrecto');
		}
		if (indx === -1) {
			throw new Error(`Competencia con id ${compId} no encontrada en bufferCompNiv`);
		}
		this.logger.debug(`Guardando competencias con su nivel objetivo`, compId, nivId);
		this.bufferCompNiv[indx].niv = nivObj;
	}

	/** Creates the object type CompAndNiv[comp,niv] and emits it */
	nivelClicked(): void {
		const objCompNivel = this.bufferCompNiv.filter<CompAndNiv>((v): v is CompAndNiv => !!v.niv && !!v.comp); // creates the object if is true
		this.logger.verbose('Emitiendo nivel objetivo por competencia');
		this.compAndNivEmitter.emit(objCompNivel); //emit the object to the parent
	}
}
