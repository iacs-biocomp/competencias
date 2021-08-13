import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EvModelsAdmnService, EvaluacionesAdmService } from 'services/data';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IEvModelGetDTO, ICompGetDTO, IEvSendDTO, IEvModelAddDTO } from 'sharedInterfaces/DTO';
import { IEvModel, ICatComp, ICompetencia } from 'sharedInterfaces/Entity';
import { RequiredAndNotNull } from 'sharedInterfaces/Utility';
// TODO: Refactor
import { CompAndNiv } from './obj-niveles-select/obj-niveles-select.component';

type modelCtrlView = {
	// ?? Comprobar si sirve
	evModels: IEvModel[];
	/** Descripción de la evaluación, bindeado al input en el html */
	evDescription: string | undefined;
	/** Los rangos de fechas de esa evaluacion, periodo de propuesta, validación, valoración... */
	rangesForm: FormGroup | undefined;
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

/** Componente destinado a la creación de una nueva evaluación, modal de bootstrap */
export type modelCompNiv = {
	evModel: RequiredAndNotNull<IEvModel>;
	compNivObj: CompAndNiv[];
};

@Component({
	selector: 'app-new-ev-modal [onEvSaved]',
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
	) {}

	async ngOnInit(): Promise<void> {
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
		});
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
		//LOG: `se filtran los modelos de las evaluaciones`
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
		//LOG: `devuelve true si el formulario es correcto`
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
		//LOG: `se selecciona la catComp ${idCatComp}`
		this.cCompCtl.cCompSelectedObs.next(this.cCompCtl.catComps.find(catComp => catComp.id === idCatComp)); //Find if the catComp exists
	}

	/** Save in the backend the evaluation to create */
	async save() {
		//LOG: `se muestran más comportamientos al darle a click`
		const cComp = this.cCompCtl.cCompSelectedObs.value;
		const modelo = this.modelCtl.evModelSelected;
		if (!this.modelCtl.rangesForm || !cComp || !modelo) {
			throw new Error('Contacte con un administrador');
		} //Se quita undefined
		const form = this.modelCtl.rangesForm.value;
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
		this.evToAdd = {
			description: this.modelCtl.evDescription as string,
			catComp: cComp,
			model: evModelDB,
			iniDate: form.propuestaStart as Date,
			finPropuestas: form.propuestaEnd as Date,
			iniValidacion: form.validacionStart as Date,
			endValidacion: form.validacionEnd as Date,
			iniValoracion: form.valoracionStart as Date,
			endValoracion: form.valoracionEnd as Date,
			iniPerEvaluado: form.evaluacionStart as Date,
			endPerEvaluado: form.evaluacionEnd as Date,
			organiDate: form.organiDate as Date,
		};
		const saved = await this.evSv.add(this.evToAdd);
		console.log(this.evToAdd);
		//	const saved = true;
		if (saved) {
			this.onEvSaved();
			console.log('Vista actualizada');
		} //Actualiza la vista del componente padre, se pasa función por parametro
	}

	/**
	 * Method that saves the evaluation when the levels have been setted
	 * @param niveles
	 */
	onNivelesSetted(niveles: CompAndNiv[]) {
		//LOG: `se muestran más comportamientos al darle a click`
		this.save();
	}

	/**
	 * Sets
	 * @param niveles
	 */
	onCompetenciasSetted(competencias: ICompetencia[]) {
		//LOG: `se muestran más comportamientos al darle a click`
		this.compsSelectedObs.next(competencias);
		const cCompSelected = this.cCompCtl.cCompSelectedObs.value;
		if (!cCompSelected) {
			throw new Error('No se ha seleccionado una cComp, contacte con un programador');
		}
		const refModel = this.modelCtl.allReferenceModels.find(model => model.catComp.id === cCompSelected.id)!;
		this.modelCtl.evModelSelected = refModel;

		this.nivModal.nativeElement.click();
	}
}
