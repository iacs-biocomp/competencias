import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EvModelsAdmnService, EvaluacionesAdmService } from 'services/data';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IEvModelGetDTO, ICompGetDTO, IEvSendDTO, IEvModelAddDTO } from 'sharedInterfaces/DTO';
import { IEvModel, ICatComp, ICompetencia } from 'sharedInterfaces/Entity';
import { RequiredAndNotNull } from 'sharedInterfaces/Utility';
// TODO: Refactor
import { CompAndNiv } from './obj-niveles-select/obj-niveles-select.component';
import { LogService } from 'src/app/shared/log/log.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

type modelCtrlView = {
	// ?? Comprobar si sirve
	evModels: IEvModel[];
	/** Descripción de la evaluación, bindeado al input en el html */
	evDescription: string | undefined;
	/** Los rangos de fechas de esa evaluacion, periodo de propuesta, validación, valoración... */
	rangesForm: ExtFormGroup | undefined;
	/** Gets all the reference models (array)  */
	allReferenceModels: IEvModelGetDTO[];
	/** El modelo seleccionado, se settea cuando el componente hijo devuelve las comps seleccionadas */
	evModelSelected: IEvModelGetDTO | undefined;
};

type catCompCtrlView = {
	catComps: ICatComp[];
	/** Emits the cCompSelected that is used for the new ev */
	cCompSelectedObs: BehaviorSubject<ICatComp | undefined>;
};

type ExtFormGroup = FormGroup & {
	controls: {
		propuestaStart: Omit<AbstractControl, 'value'> & { value: Date };
		propuestaEnd: Omit<AbstractControl, 'value'> & { value: Date };
		validacionStart: Omit<AbstractControl, 'value'> & { value: Date };
		validacionEnd: Omit<AbstractControl, 'value'> & { value: Date };
		valoracionStart: Omit<AbstractControl, 'value'> & { value: Date };
		valoracionEnd: Omit<AbstractControl, 'value'> & { value: Date };
		evaluacionStart: Omit<AbstractControl, 'value'> & { value: Date };
		evaluacionEnd: Omit<AbstractControl, 'value'> & { value: Date };
		organiDate: Omit<AbstractControl, 'value'> & { value: Date };
	};
};

/** Componente destinado a la creación de una nueva evaluación, modal de bootstrap */
export type modelCompNiv = {
	evModel: RequiredAndNotNull<IEvModel>;
	compNivObj: CompAndNiv[];
};

@Component({
	selector: 'app-new-ev-modal [onEvSaved] [modalId]',
	templateUrl: './new-ev-modal.component.html',
	styleUrls: ['./new-ev-modal.component.scss'],
})
export class NewEvModalComponent implements OnInit, OnDestroy {
	/** Observable to send an array of competences of a model reference selected by the cComp  */
	compsObs = new BehaviorSubject<ICompGetDTO[]>([]);
	/** Observable with the array of competences selected */
	compsSelectedObs = new BehaviorSubject<ICompetencia[]>([]);
	@ViewChild('closeEvModal') closeModalBtn!: ElementRef<HTMLButtonElement>;
	@ViewChild('nivSelectBtn') nivModal!: ElementRef<HTMLButtonElement>;
	/** Metodo que se ejecuta cuando se guarda una evaluación El componente padre debe pasarlo como parametro */
	@Input() onEvSaved!: () => void | Promise<void>;
	/** The component primary id, used by bootstrap */
	@Input() modalId!: string;

	cCompCtl: catCompCtrlView = {
		/** Array with all the current catComps */
		catComps: [],
		cCompSelectedObs: new BehaviorSubject<ICatComp | undefined>(undefined),
	};
	/** Array that should have all component's subscriptions */
	#subs: Subscription[] = [];

	modelCtl: modelCtrlView = {
		// TODO: [8]{N1} Comprobar si sirve
		evModels: [],
		evDescription: undefined,
		rangesForm: undefined,
		allReferenceModels: [],
		evModelSelected: undefined,
	};

	/** La evaluación que se añadirá a la bbdd */
	evToAdd!: IEvSendDTO;

	constructor(
		private evModelSv: EvModelsAdmnService,
		private fb: FormBuilder,
		private evSv: EvaluacionesAdmService,
		private readonly logger: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente new-ev-modal');
		this.modelCtl.allReferenceModels = await this.evModelSv.getAllReference();
		this.cCompCtl.catComps = this.modelCtl.allReferenceModels.map(refModel => refModel.catComp);

		this.cCompCtl.catComps = [...this.cCompCtl.catComps].sort((a, b) => a.id.localeCompare(b.id));
		// TODO: [4]{N2} Añadir validadores que comprueben que las fechas de inicio y final esten en orden Ejemplo: propuestaEnd < validacionStart
		// ?? Preguntar a vega si tiene que ser asi o pueden solaparse (propuestaEnd > validacionStart)
		this.modelCtl.rangesForm = this.fb.group({
			propuestaStart: ['', Validators.required],
			propuestaEnd: ['', Validators.required],
			validacionStart: ['', Validators.required],
			validacionEnd: ['', Validators.required],
			valoracionStart: ['', Validators.required],
			valoracionEnd: ['', Validators.required],
			evaluacionStart: ['', [Validators.required]],
			evaluacionEnd: ['', Validators.required],
			organiDate: ['', Validators.required],
		}) as ExtFormGroup;

		this.#subs.push(
			this.cCompCtl.cCompSelectedObs.subscribe(cComp => {
				if (!cComp) {
					return;
				}
				const comps = getCompetOfModel(
					this.modelCtl.allReferenceModels.find(m => m.catComp.id === cComp.id)!,
				);
				this.compsObs.next(comps);
			}),
		);
	}

	ngOnDestroy(): void {
		this.logger.verbose('Destruyendo NewEvModalComponent');
		this.closeModalBtn.nativeElement.click();
		this.#subs.forEach(s => s.unsubscribe());
	}

	/**
	 * Filtra de this.evModels y elimina los que no tengan una catComp igual a this.cCompSelectedObs.value
	 * Devuelve [] en caso de que este undefined cualquiera de estos dos.
	 *
	 * @returns El array de modelos de evaluaciones filtrado
	 */
	filterEvModels(): IEvModel[] {
		this.logger.verbose('Filtrando los modelos de las evaluaciones');
		if (!this.cCompCtl.cCompSelectedObs.value || !this.modelCtl.evModels) {
			return [];
		}
		return this.modelCtl.evModels.filter(
			evModel => evModel.catComp?.id === this.cCompCtl.cCompSelectedObs.value?.id,
		);
	}

	/**
	 * @returns `true` if the form is correct, `false` if it's not
	 */
	isFormValid(): boolean {
		if (
			!this.modelCtl.rangesForm ||
			!this.modelCtl.evDescription ||
			this.modelCtl.evDescription === '' ||
			!this.cCompCtl.cCompSelectedObs.value
		) {
			return false;
		}
		return this.modelCtl.rangesForm.valid;
	}

	/** Set the catComp selected for the new evaluation */
	setCatComp(idCatComp: string): void {
		this.logger.debug(`Seleccionando id de la catComp de la evaluacion: ${idCatComp}`);
		this.cCompCtl.cCompSelectedObs.next(this.cCompCtl.catComps.find(catComp => catComp.id === idCatComp)); //Find if the catComp exists
	}

	/** Save in the backend the evaluation to create */
	async save() {
		this.logger.verbose('Enviando la evaluacion al backend');
		const cComp = this.cCompCtl.cCompSelectedObs.value;
		const modelo = this.modelCtl.evModelSelected;
		if (!this.modelCtl.rangesForm || !cComp || !modelo) {
			throw new Error('Contacte con un administrador');
		}
		if (!modelo.subModels) {
			throw new Error('Contacte con un administrador');
		}

		const idsComps = this.compsSelectedObs.value.map(c => c.id);
		const subModelsFiltered = modelo.subModels.filter(subModel => idsComps.includes(subModel.competencia.id));
		let modelToSend: IEvModelAddDTO = {
			catComp: cComp,
			subModels: subModelsFiltered,
			reference: false,
		};
		const evModelDB = await this.evModelSv.save(modelToSend, false);
		const rangesControls = this.modelCtl.rangesForm.controls;
		this.evToAdd = {
			description: this.modelCtl.evDescription as string,
			catComp: cComp,
			model: evModelDB,
		  iniDate: rangesControls.propuestaStart.value,
		  finPropuestas: rangesControls.propuestaEnd.value,
		  iniValidacion: rangesControls.validacionStart.value,
		  endValidacion: rangesControls.validacionEnd.value,
		  iniValoracion: rangesControls.valoracionStart.value,
		  endValoracion: rangesControls.valoracionEnd.value,
		  iniPerEvaluado: rangesControls.evaluacionStart.value,
		  endPerEvaluado: rangesControls.evaluacionEnd.value,
		  organiDate: rangesControls.organiDate.value,
		};
		this.logger.debug(`Evaluacion a guardar:`, this.evToAdd);
		const saved = await this.evSv.add(this.evToAdd);
		//	const saved = true;
		if (saved) {
			this.logger.verbose('Evaluacion guardada con éxito');
			this.onEvSaved();
		} //Actualiza la vista del componente padre, se pasa función por parametro
	}

	/**
	 * Method that saves the evaluation when the levels have been setted
	 * @param niveles
	 */
	onNivelesSetted(niveles: CompAndNiv[]) {
		this.logger.verbose('Guardando niveles de la evaluación');
		this.save();
	}

	/**
	 * Sets
	 * @param niveles
	 */
	onCompetenciasSetted(competencias: ICompetencia[]) {
		this.compsSelectedObs.next(competencias);
		const cCompSelected = this.cCompCtl.cCompSelectedObs.value;
		if (!cCompSelected) {
			throw new Error('No se ha seleccionado una cComp, contacte con un programador');
		}
		this.logger.debug(`Guardando las competencias de la evaluación`, competencias);
		const refModel = this.modelCtl.allReferenceModels.find(model => model.catComp.id === cCompSelected.id)!;
		this.modelCtl.evModelSelected = refModel;
		this.nivModal.nativeElement.click();
	}

	/**
	 * Setter for OrganiDate, emitted from datepicker component
	 * @param event Event from date picker
	 */
	setOrganiDate(_: string, event: MatDatepickerInputEvent<Date>): void {
		if (!this.modelCtl.rangesForm) {
			const err = new Error('');
			this.logger.error('modelCtl de NewEvModalComponent undefined o null when OrganiDate was setted', err);
			throw err;
		}
		this.modelCtl.rangesForm.controls['organiDate'].setValue(event.value);
		console.log(this.modelCtl.rangesForm.value);
	}
}
