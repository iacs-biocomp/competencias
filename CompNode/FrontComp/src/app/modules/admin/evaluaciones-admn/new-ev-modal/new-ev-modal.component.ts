import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { getCompetOfModel } from 'sharedCode/Utility';
import { IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, ICompetencia, IEvaluacion, IEvModel } from 'sharedInterfaces/Entity';
import { RequiredAndNotNull } from 'sharedInterfaces/Utility';
import { EvModelsAdmnService } from '../services/ev-models-admn.service';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';
import { CompAndNiv } from './model-nivel4-comp-select/model-nivel4-comp-select.component';

type modelCtrlView = {
	// ?? Comprobar si sirve
	evModels: IEvModel[];
	/** Descripción de la evaluación, bindeado al input en el html */
	evDescription?: string;
	/** Los rangos de fechas de esa evaluacion, periodo de propuesta, validación, valoración... */
	rangesForm: FormGroup | undefined;
	/** Gets all the reference models (array)  */
	allReferenceModels: IRefModel[];
	/** El modelo seleccionado, se settea cuando el componente hijo devuelve las comps seleccionadas */
	evModelSelected: IEvModel | undefined;
};

type catCompCtrlView = {
	catComps: ICatComp[];
	/** Sends the catComp selected to creates the evaluation */
	cCompSelectedObs: BehaviorSubject<ICatComp | undefined>;
};

/** Same type as IEvaluacion but without id because is not necesary for create a new one */
export type evAddDTO = RequiredAndNotNull<Omit<IEvaluacion, 'id'>>;
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
	compsObs = new BehaviorSubject<ICompetencia[]>([]);
	//TODO: tsdoc
	compsSelectedObs = new BehaviorSubject<ICompetencia[]>([]);

	@ViewChild('nivSelectBtn') nivModal!: ElementRef;
	/** Metodo que se ejecuta cuando se guarda una evaluación El componente padre debe pasarlo como parametro */
	@Input() onEvSaved!: () => void | Promise<void>;

	cCompCtl: catCompCtrlView = {
		/** Array with all the current catComps */
		catComps: [],
		//TODO: Tsdoc
		cCompSelectedObs: new BehaviorSubject<ICatComp | undefined>(undefined),
	};

	modelCtl: modelCtrlView = {
		// ?? Comprobar si sirve
		evModels: [],
		evDescription: undefined,
		rangesForm: undefined,
		allReferenceModels: [],
		evModelSelected: undefined,
	};

	/** La evaluación que se añadirá a la bbdd */
	evToAdd!: evAddDTO;

	constructor(private evModelSv: EvModelsAdmnService, private fb: FormBuilder, private evSv: EvaluacionesAdmService) {}

	async ngOnInit(): Promise<void> {
		this.modelCtl.allReferenceModels = await this.evModelSv.getAllReference();
		this.cCompCtl.catComps = this.modelCtl.allReferenceModels.map(refModel => refModel.catComp);

		this.cCompCtl.catComps = this.cCompCtl.catComps.sort((a, b) => a.id.localeCompare(b.id));
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
		this.cCompCtl.cCompSelectedObs.subscribe(cComp => {
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
	 * Filtra de this.evModels y elimina los que no tengan una catComp igual a this.cCompSelectedObs.value
	 * Devuelve [] en caso de que este undefined cualquiera de estos dos.
	 *
	 * @returns El array de modelos de evaluaciones filtrado
	 */
	filterEvModels(): IEvModel[] {
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
		if (!this.modelCtl.rangesForm) {
			return false;
		} //Se quita undefined
		if (!this.modelCtl.evDescription || this.modelCtl.evDescription === '') {
			return false;
		}
		if (!this.cCompCtl.cCompSelectedObs.value) {
			return false;
		}
		return this.modelCtl.rangesForm.valid;
	}

	/** Sets the catComp selected for the new evaluation */
	setCatComp(idCatComp: string): void {
		this.cCompCtl.cCompSelectedObs.next(this.cCompCtl.catComps.find(catComp => catComp.id === idCatComp)); //Find if the catComp exists
	}

	/** Save in the backend the evaluation to create */
	async save() {
		const cComp = this.cCompCtl.cCompSelectedObs.value;
		const modelo = this.modelCtl.evModelSelected;
		if (!this.modelCtl.rangesForm || !cComp || !modelo) {
			throw new Error('Contacte con un administrador');
		} //Se quita undefined
		const form = this.modelCtl.rangesForm.value;

		console.log('Save evaluation: ', this.evToAdd);
		if (!modelo.subModels){
			throw new Error('Contacte con un administrador');
		}
		let modelToSend: IModelDTO = {
			catComp: cComp,
			subModels: modelo.subModels,
		};
		const evModelDB = await this.evModelSv.save(modelToSend, false);
		this.evToAdd = {
			description:
				this.modelCtl.evDescription === undefined ? 'Descripción por defecto' : this.modelCtl.evDescription, //TODO: Return si desc == undefined, validator en formcontrol
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
		};
		const saved = await this.evSv.save(this.evToAdd);
	//	const saved = true;
			if (saved) {
				this.onEvSaved();
			} //Actualiza la vista del componente padre, se pasa función por parametro
	}

	onNivelesSetted(niveles: CompAndNiv[]) {
		// TODO: Guardar evaluacion
		this.save();
		//		console.log(niveles);
	}

	onCompetenciasSetted(competencias: ICompetencia[]) {
		this.compsSelectedObs.next(competencias);
		// TODO: Añadir la función que del modelo de referencia crea otro con las comps seleccionadas
		 this.modelCtl.evModelSelected =

		this.nivModal.nativeElement.click();
	}
}
