import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia, IEvaluacion, IEvModel } from 'sharedInterfaces/Entity';
import { RequiredAndNotNull } from 'sharedInterfaces/Utility';
import { EvModelsAdmnService } from '../services/ev-models-admn.service';
import { CompAndNiv } from './model-nivel4-comp-select/model-nivel4-comp-select.component';

type modelCtrlView = {
	evModels: IEvModel[];
	/** Descripción de la evaluación, bindeado al input en el html */
	evDescription?: string;
	/** Los rangos de fechas de esa evaluacion, periodo de propuesta, validación, valoración... */
	rangesForm: FormGroup | undefined;
	/** Gets all the reference models (array)  */
	allReferenceModels: IRefModel[];
};

type catCompCtrlView = {
	catComps: ICatComp[];
	catCompSelected?: ICatComp;
};

/** Same type as IEvaluacion but without id because is not necesary for create a new one */
export type evAddDTO = Omit<IEvaluacion, 'id'>;
/** Componente destinado a la creación de una nueva evaluación, modal de bootstrap */
export type modelCompNiv = {
	evModel: RequiredAndNotNull<IEvModel>;
	compNivObj: CompAndNiv[];
};
@Component({
	selector: 'app-new-ev-modal',
	templateUrl: './new-ev-modal.component.html',
	styleUrls: ['./new-ev-modal.component.scss'],
})
export class NewEvModalComponent implements OnInit {
	/** Observable to send an array of competences of a model reference selected by the cComp  */
  compsObs = new BehaviorSubject<ICompetencia[]> ([]);
	/** Sends the catComp selected to creates the evaluation */
	catCompObs = new BehaviorSubject<ICatComp | undefined>(undefined);
	@ViewChild('nivSelectBtn') nivModal!: ElementRef;
	/** Metodo que se ejecuta cuando se guarda una evaluación El componente padre debe pasarlo como parametro */
  @Input() onEvSaved!: () => void | Promise<void>;

	catCompCtl: catCompCtrlView = {
		/** Array with all the current catComps */
		catComps: [],
		/** CatComp selected */
		catCompSelected: undefined,
	};

	modelCtl: modelCtrlView = {
		evModels: [],
		evDescription: undefined,
		rangesForm: undefined,
		allReferenceModels: [],
	};

	/** La evaluación que se añadirá a la bbdd */
	evToAdd!: evAddDTO;
	evModelSelected!: IEvModel;

	constructor(
		private evModelSv: EvModelsAdmnService,
		private fb: FormBuilder,
	) {}

	async ngOnInit(): Promise<void> {
		this.modelCtl.allReferenceModels = await this.evModelSv.getAllReference();
		this.catCompCtl.catComps = this.modelCtl.allReferenceModels.map(refModel => refModel.catComp);

		this.catCompCtl.catComps = this.catCompCtl.catComps.sort((a, b) => a.id.localeCompare(b.id));
		// TODO: Añadir validadores que comprueben que las fechas de inicio y final esten en orden Ejemplo: propuestaEnd < validacionStart
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
		});
		this.catCompObs.subscribe(cComp => {
		 //	console.log('suscription')
		 //	console.log(cComp);
			if (!cComp) {
				return;
			}
			const comps = getCompetOfModel(this.modelCtl.allReferenceModels.find(m => m.catComp.id === cComp.id)!);
		//	console.log(comps);
			this.compsObs.next(comps);
		});
	}

	/**
	 * Filtra de this.evModels y elimina los que no tengan una catComp igual a this.catCompSelected
	 * Devuelve [] en caso de que este undefined cualquiera de estos dos.
	 *
	 * @returns El array de modelos de evaluaciones filtrado
	 */
	filterEvModels(): IEvModel[] {
		if (!this.catCompCtl.catCompSelected || !this.modelCtl.evModels) {
			return [];
		}
		return this.modelCtl.evModels.filter(
			evModel => evModel.catComp?.id === this.catCompCtl.catCompSelected?.id,
		);
	}
	/**
	 * @returns `true` if the form is correct, `false` if it's not
	 */
	isFormValid(): boolean {
		if (!this.modelCtl.rangesForm) {
			return false;
		} //Se quita undefined
		if (!this.modelCtl.evDescription || this.modelCtl.evDescription === '') {
			return false;
		}
		if (!this.catCompCtl.catCompSelected) {
			return false;
		}
		return this.modelCtl.rangesForm.valid;
	}

	/** Sets the catComp selected for the new evaluation */
	setCatComp(idCatComp: string): void {
		this.catCompCtl.catCompSelected = this.catCompCtl.catComps.find(catComp => catComp.id === idCatComp); //Find if the catComp exists
//		console.log('SetCatComp ',	this.catCompCtl.catCompSelected );
		this.catCompObs.next(this.catCompCtl.catCompSelected);
	}

	/** Save in the backed the evaluation to create */
	async save() {
		if (!this.modelCtl.rangesForm || !this.catCompCtl.catCompSelected) {
			return;
		} //Se quita undefined
		const form = this.modelCtl.rangesForm.value;
		this.evToAdd = {
			description:
				this.modelCtl.evDescription === undefined ? 'Descripción por defecto' : this.modelCtl.evDescription, //TODO: Return si desc == undefined, validator en formcontrol
			catComp: this.catCompCtl.catCompSelected,
			model: this.evModelSelected,
			iniDate: form.propuestaStart as Date,
			finPropuestas: form.propuestaEnd as Date,
			iniValidacion: form.validacionStart as Date,
			endValidacion: form.validacionEnd as Date,
			iniValoracion: form.valoracionStart as Date,
			endValoracion: form.valoracionEnd as Date,
			iniPerEvaluado: form.evaluacionStart as Date,
			endPerEvaluado: form.evaluacionEnd as Date,
		};
		console.log('Save evaluation: ', this.evToAdd);
		//	const saved = await this.evSv.save(this.evToAdd);
		//	if (saved) {
		//		this.onEvSaved();
		//	} //Actualiza la vista del componente padre, se pasa función por parametro
	}

	/** Collects the model creates by the child  */
	modeloRecibido(model: modelCompNiv): void {
		this.evModelSelected = model.evModel;
	//	console.log(this.evModelSelected);
		this.save();
	}
	onNivelesSetted(niveles: CompAndNiv[]) {
//		console.log(niveles);
	}
	onCompetenciasSetted(competencias: ICompetencia[]) {
//		console.log(competencias, this.nivModal);
		this.nivModal.nativeElement.click();
	}
}
