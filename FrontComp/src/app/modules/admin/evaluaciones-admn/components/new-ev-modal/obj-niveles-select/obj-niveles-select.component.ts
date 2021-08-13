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
import { NivelService } from 'services/data';
import { ICompetencia, INivel } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

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
export class ObjectiveNivsSelectComponent implements OnInit, OnDestroy {
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
	/** Ref to button that closes the modal */
	@ViewChild('closeModal') closeModalBtn!: ElementRef<HTMLButtonElement>;
	/** Array that should have all component's subscriptions */
	#subs: Subscription[] = [];

	/**
	 * Array que almacena todos lo niveles actuales
	 * @deprecated Usar el observable de niveles como input del componente
	 * TODO: [9]{N1} modificar para usar el observable de niveles
	 *
	 */
	nivs: INivel[] = [];

	/** CompAndNiv[](comp, niv) partial  */

	/**
	 * partial(propiedades en opcional) de objeto compAndNiv (comp, niv)
	 */
	bufferCompNiv: Partial<CompAndNiv>[] = [];

	constructor(private nivelSv: NivelService, private readonly logger: LogService) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente obj-niveles-select');
		this.nivs = await this.nivelSv.getAllRefNivs(); // Se guardan en la var niveles los niveles de referencia
		this.#subs.push(
			this.compsObs.subscribe(comps => {
				const compToSave = comps.map(c => ({ comp: c })) as Partial<CompAndNiv>[]; //Map the coompetences and saves it in compToSave
				this.bufferCompNiv = compToSave;
			}),
		);
	}

	ngOnDestroy(): void {
		this.logger.verbose('Destruyendo componente');
		this.#subs.forEach(s => s.unsubscribe());
		this.closeModalBtn.nativeElement.click();
	}

	/**
	 * Saves the objective level with their competence
	 *
	 * @param comp Competence with which the objective level is associated
	 * @param niv The objective level or its code (NOT id) that will be associated with the competence
	 * @throws Error if objective level is not valid
	 */
	setNivel(comp: ICompetencia, niv: INivel | string): void {
		this.logger.debug(`Guardando competencias con su nivel objetivo`, comp, niv);
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
		this.logger.verbose('Emitiendo nivel objetivo por competencia');
		this.compAndNivEmitter.emit(objCompNivel); //emit the object to the parent
	}
}
