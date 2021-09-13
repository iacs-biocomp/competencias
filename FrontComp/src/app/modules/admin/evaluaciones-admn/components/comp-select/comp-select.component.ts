import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { find, remove } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { getCompetOfModel, toggleInArray } from 'sharedCode/Utility';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

/** Control view for html, all view variables and helper functions inside */
type CompetenciaCtrlView = {
	/** Array with the selected competences, type ICompetencia*/
	compsSelected: ICompetencia[];
	/**
	 * Test if given competence is in compsSelected array
	 * @param comp Competence tested or its identifier
	 */
	isCompSelected(comp: ICompetencia | string): boolean;
};
/** Type for component config */
type CConfig = {
	title: string;
};

/**
 * Componente que muestra una lista de competencias para que el usuario las seleccione,
 * emite las que se han seleccionado,tiene varias opciones de configuarción
 */
@Component({
	selector: 'app-comp-select-modal [compsObs] [idModal]',
	templateUrl: './comp-select.component.html',
	styleUrls: ['./comp-select.component.scss'],
})
export class CompSelectComponent implements OnInit, OnDestroy {
	constructor(private readonly logger: LogService) {}
	/** Observable con todas las comps a mostrar, cuando emite nuevo valor se actualiza el componente */
	@Input() compsObs = new BehaviorSubject<ICompetencia[]>([]);
	/** Array de competencias pre-selecionadas */
	@Input() preSelectedComps?: ICompetencia[];
	/** Modal id for toggle it with bootstrap */
	@Input() idModal!: string;
	/** Component configuration object */
	@Input() cConfig: CConfig = { title: 'Seleccione las competencias' };
	/** Emits the selected competences when finish button is clicked */
	@Output('onModalFinish') finishEmitter = new EventEmitter<ICompetencia[]>();
	/** Button that closes bootstrap modal when clicked */
	@ViewChild('closeModal') closeModalBtn!: ElementRef<HTMLButtonElement>;

	/** Control view for html, all view's variables and helper functions inside */
	cv: CompetenciaCtrlView = {
		compsSelected: [],
		isCompSelected(comp: Pick<ICompetencia, 'id'> | ICompetencia['id']) {
			const cId = typeof comp === 'string' ? comp : comp.id;
			if (!!this.compsSelected.find(c => cId === c.id)) {
				return true;
			} else {
				return false;
			}
		},
	};

	#subs: Subscription[] = [];

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Iniciando CompSelectComponent');
		this.#subs.push(
			this.compsObs.subscribe(next => {
				this.preSelectedComps = this.preSelectedComps ?? []; //Se quita undefined
				console.log(next, this.preSelectedComps);
				this.cv.compsSelected = this.preSelectedComps;
			}),
		);
	}

	ngOnDestroy(): void {
		this.logger.verbose('Destruyendo CompSelectComponent');
		this.#subs.forEach(sub => sub.unsubscribe());
		this.closeModalBtn.nativeElement.click();
	}

	getCompetsOfModel = getCompetOfModel;

	/**
	 * Añade una comp si no esta en cv.compsSelected o la borra si está
	 * @param comp Competencia a borrar o añadir en el array de seleccionadas
	 */
	toggleComp(comp: ICompetencia) {
		const compAlreadySelected = find(this.cv.compsSelected, { id: comp.id });
		if (!compAlreadySelected) {
			this.logger.debug(`Añadiendo comp a la lista compsSelected`, comp);
			this.cv.compsSelected.push(comp);
		} else {
			this.logger.debug(`Borrando comp a la lista compsSelected`, comp);
			remove(this.cv.compsSelected, { id: comp.id });
		}
	}

	submit(): void {
		this.logger.verbose('Emitiendo competencias selecionadas');
		this.finishEmitter.emit(this.cv.compsSelected);
		this.cv.compsSelected = [];
	}
}
