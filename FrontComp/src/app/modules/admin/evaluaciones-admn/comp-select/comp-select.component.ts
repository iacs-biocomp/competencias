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
import { BehaviorSubject, Subscription } from 'rxjs';
import { getCompetOfModel, toggleInArray } from 'sharedCode/Utility';
import { ICompetencia } from 'sharedInterfaces/Entity';

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

	subs: Subscription[] = [];

	async ngOnInit(): Promise<void> {
		if (!this.compsObs.value) {
			throw new Error('Has renderizado el componente antes de elegir las competencias, o esta es undefined');
		}
		this.subs.push(
			this.compsObs.subscribe(() => {
				this.preSelectedComps = !this.preSelectedComps ? [] : this.preSelectedComps; //Se quita undefined
				console.log(this.preSelectedComps);
				this.cv.compsSelected = this.preSelectedComps;
			}),
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
		this.closeModalBtn.nativeElement.click();
	}

	getCompetsOfModel = getCompetOfModel;

	/**
	 * Añade una comp si no esta en cv.compsSelected o la borra si está
	 * @param comp Competencia a borrar o añadir en el array de seleccionadas
	 */
	toggleComp(comp: ICompetencia) {
		//LOG: `se añade una comp a las comps seleccionadas o la quita si está ${comp}`
		toggleInArray<ICompetencia>(comp, this.cv.compsSelected);
	}

	submit(): void {
		this.finishEmitter.emit(this.cv.compsSelected);
		this.cv.compsSelected = [];
	}
}
