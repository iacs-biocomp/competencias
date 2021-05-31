import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, IEvaluacion, IEvModel } from 'sharedInterfaces/Entity';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { EvModelsAdmnService } from '../services/ev-models-admn.service';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

/** Same type as IEvaluacion but without id because is not necesary for create a new one */
export type evAddDTO = Omit<IEvaluacion, 'id'>;
/** Componente destinado a la creación de una nueva evaluación, modal de bootstrap */
@Component({
	selector: 'app-new-ev-modal',
	templateUrl: './new-ev-modal.component.html',
	styleUrls: ['./new-ev-modal.component.scss'],
})
export class NewEvModalComponent implements OnInit {
	/** Metodo que se ejecuta cuando se guarda una evaluación El componente padre debe pasarlo como parametro */
	@Input()
	onEvSaved!: () => void | Promise<void>;
	evModels!: IEvModel[];
	catComps!: ICatComp[];
	catCompSelected?: ICatComp;
	/** Descripción de la evaluación, bindeado al input en el html */
	evDescription?: string;
	/** La evaluación que se añadirá a la bbdd */
	evToAdd!: evAddDTO;
	evModelSelected!: IEvModel;
	/** Los rangos de fechas de esa evaluacion, periodo de propuesta, validación, valoración... */
	rangesForm: FormGroup | undefined;
	//TODO: Tsdoc
	catCompObs = new BehaviorSubject<ICatComp | undefined>(undefined);
	allReferenceModels: IRefModel[] = [];
	constructor(
		private evSv: EvaluacionesAdmService,
		private evModelSv: EvModelsAdmnService,
		private cCompSv: CatCompetencialesService,
		private fb: FormBuilder,
	) {}

	async ngOnInit(): Promise<void> {
		this.allReferenceModels = await this.evModelSv.getAllReference();
		this.catComps = this.allReferenceModels.map(refModel => refModel.catComp);
		console.log(this.catComps);
		this.catComps = this.catComps.sort((a, b) => a.id.localeCompare(b.id));
		// TODO: Añadir validadores que comprueben que las fechas de inicio y final esten en orden Ejemplo: propuestaEnd < validacionStart
		// ?? Preguntar a vega si tiene que ser asi o pueden solaparse (propuestaEnd > validacionStart)
		this.rangesForm = this.fb.group({
			propuestaStart: ['', Validators.required],
			propuestaEnd: ['', Validators.required],
			validacionStart: ['', Validators.required],
			validacionEnd: ['', Validators.required],
			valoracionStart: ['', Validators.required],
			valoracionEnd: ['', Validators.required],
			evaluacionStart: ['', [Validators.required]],
			evaluacionEnd: ['', Validators.required],
		});

		this.catCompObs.subscribe(c => console.log(c));
	}

	/**
	 * Filtra de this.evModels y elimina los que no tengan una catComp igual a this.catCompSelected
	 * Devuelve [] en caso de que este undefined cualquiera de estos dos.
	 * @returns El array de modelos de evaluaciones filtrado
	 */
	filterEvModels(): IEvModel[] {
		if (!this.catCompSelected || !this.evModels) {
			return [];
		}
		return this.evModels.filter(evModel => evModel.catComp?.id == this.catCompSelected?.id);
	}
	/**
	 * @returns `true` si el formulario es valido y `false` en caso contrario
	 */
	isFormValid(): boolean {
		if (!this.rangesForm) return false; //Se quita undefined
		if (!this.evDescription || this.evDescription === '') return false;
		if (!this.catCompSelected) return false;
		return this.rangesForm.valid;
	}

	nextModal() {}

	async save() {
		if (!this.rangesForm) return; //Se quita undefined
		const form = this.rangesForm.value;
		this.evToAdd = {
			description: this.evDescription === undefined ? 'Descripción por defecto' : this.evDescription, //TODO: Return si desc == undefined, validator en formcontrol
			catComp: this.catCompSelected!,
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
		console.log(this.evToAdd);
		const saved = await this.evSv.save(this.evToAdd);
		if (saved) this.onEvSaved(); //Actualiza la vista del componente padre, se pasa función por parametro
	}
	setCatComp(idCatComp: string): void {
		const cCompToSet = this.catComps.find(catComp => catComp.id === idCatComp);
		this.catCompObs.next(cCompToSet);
	}
}
