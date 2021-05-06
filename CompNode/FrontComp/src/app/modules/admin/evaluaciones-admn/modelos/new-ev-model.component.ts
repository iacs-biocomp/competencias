import { Component, OnInit } from '@angular/core';
import { ICatComp } from 'sharedInterfaces/ICategorias';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/IEvaluaciones';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { ComportService } from '../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../niveles-admin/services/nivel.service';
import { EvaluacionesAdmService } from '../services/evaluaciones-adm.service';

type DbData = {
	/** listado de categorias competenciales */
	catComps: ICatComp[];
	/** listado de competencias */
	comps: ICompetencia[];
	/** listado de comportamientos */
	comports: IComportamiento[];
	/** listado de niveles */
	niveles: INivel[];
	/** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	modelToAdd: IModelDTO;
};

type MiCompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;

type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;

type ComportCtrlView = {
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
};
interface Validators {
	nivObjetivoValidator: (competencias: MiCompetencia[]) => boolean;
}

@Component({
	selector: 'app-new-ev-model',
	templateUrl: './new-ev-model.component.html',
	styleUrls: ['./new-ev-model.component.css'],
})
export class NewEvModelComponent implements OnInit {
	/** Objeto que tiene los datos usados para los select */
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
		},
	};
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
	};
	validators: Validators = {
		nivObjetivoValidator: (competencias: MiCompetencia[]) => {
			var valid = true;
			competencias.forEach(c => {
				// console.log(c.nivObjetivo);
				if (!c.nivObjetivo) {
					valid = false;
				}
			});
			// console.log(valid);
			return valid;
		},
	};

	/** Guarda la lista de competencias seleccionadas */
	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];
	/** Guarda la categoria competencial seleccionada */
	catCompeteSelected!: ICatComp;

	/**
	 * Modelo a guardar en la bbdd, es la 'referencia'
	 * @deprecated Usar dbData.modelToAdd
	 */
	addModelo: IModelDTO = {
		catComp: {
			id: 'CR6',
			description: 'CatComp 6',
		},
		subModels: [
			{
				competencia: {
					id: 'C2',
					descripcion: 'Liderazgo',
					createdAt: undefined,
				},
				comportamientos: [
					{
						id: 'c04',
						descripcion: 'ooo',
						subModels: undefined,
					},
				],
				nivel: {
					id: 'N1',
					valor: 1,
					subModels: undefined,
				},
			},
		],
	};

	subModel: ISubModel = {
		modelos: undefined,
		nivel: {
			id: 'N1',
			valor: 1,
			subModels: undefined,
		},
		competencia: {
			id: 'C01',
			descripcion: 'COMP1',
			createdAt: undefined,
		},
		comportamientos: [
			{
				id: 'C01',
				descripcion: 'COMP1',
				subModels: undefined,
			},
		],
	};

	/** Posicion actual de la vista (sirve para comprobar si se puede pasar y volver de tab) */
	current = 0;

	/** Boolean para comprobar que se puede pasar de vista*/
	isDisabled = true;

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
		private evModelSv: EvaluacionesAdmService,
	) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAllCompt(),
			this.nivSv.getAll(),
			this.comportSv.getAll(),
		]);
		this.dbData.catComps = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.dbData.comports = promises[3];
		// setInterval(() => console.log(this.comportCtl), 5500);
		// setInterval(() => console.log(this.competenciasSelect), 5500);
		// setInterval(() => console.log(this.dbData.modelToAdd), 5500);
	}

	/** Selecciona la cat competen del modelo */
	selectCatComp(catCompet: ICatComp) {
		if (!catCompet) {
			return;
		}
		this.catCompeteSelected = catCompet;
		this.dbData.modelToAdd.catComp = this.catCompeteSelected;
	}

	/** Selecciona las competencias del submodelo */
	selectCompet(compete: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compete);
		if (index == -1) {
			this.competenciasSelect.push(compete);
			// console.log(this.dbData.comps[index]);
		} else {
			this.competenciasSelect.splice(index, 1);
		}
	}

	/** Selecciona los comportamientos del submodelo */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected!.indexOf(comport);
		if (index == -1) {
		//	console.log(`adding ${comport}`);
			arrToPush.push(comport);
		} else {
			arrToPush.splice(index, 1);
		}
	}

	/** Selecciona el nivel objetivo de cada competencia */
	selectNivelObjetivo(nivel: INivel, compet: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compet);
		this.competenciasSelect[index].nivObjetivo = nivel;
	}

	/** Cuando se pulsa una opcion la ventana hace scroll hasta el botón de 'siguiente'	*/
	scrollToButton(element: HTMLElement) {
		element.scrollIntoView();
	}

	/** Comprueba que las vistas del modelo pueden moverse izquierda y derecha si existe otra vista contigua */
	move(derecha: boolean) {
		if (derecha && this.current < 3) {
			this.current++;
		}
		if (!derecha && this.current > 0) {
			this.current--;
		}
	}


	addAllComports(): void {
	// console.log(`ForEach comportsSelected `);
  // console.log(this.comportCtl.comportsSelected);
		this.comportCtl.comportsSelected.forEach(comport =>
			this.addComportToCompet(this.comportCtl.compSelected!, this.comportCtl.nivSelected!, comport),
		);
	}

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comport: IComportamiento): void {
	//	console.log(comp, niv, comport);
		let matchSubModel = this.dbData.modelToAdd.subModels.find(
			x => x.competencia?.id === comp.id && x.nivel?.id === niv.id,
		);
		if (!matchSubModel) {
			matchSubModel = {
				nivel: niv,
				competencia: comp,
				comportamientos: [],
			};
			this.dbData.modelToAdd.subModels.push(matchSubModel);
		}
		const comportIndx = matchSubModel.comportamientos?.indexOf(comport);
		if (comportIndx === -1) {
			matchSubModel.comportamientos?.push(comport);
		}
		return;
	}

	findSubModel(subModels: ISubModel[], comp: ICompetencia, niv: INivel) {
		const oe = subModels.find(subModel => subModel.competencia === comp && subModel.nivel === niv);
	// console.log(oe);
	// console.log(subModels);
		return oe;
	}
	findSubModels(subModels: ISubModel[], comp: ICompetencia) {
		const oe = subModels.filter(subModel => subModel.competencia === comp);
  //console.log(oe);
	//console.log(subModels);
		return oe;
	}
	getAllComportsOfComp(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		const subModelos = this.findSubModels(subModels, comp);
		let comports:IComportamiento[] = [];
		subModelos.forEach((s)=>comports.concat(s.comportamientos!));
		return comports;
	}
	printComports(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[]{
		let comports:IComportamiento[] = [];
		let matchComport = this.getAllComportsOfComp(comp, subModels).find(x=> x.subModels == subModels);
		console.log(matchComport);
		if (!matchComport){
			return comports.filter(x=>!matchComport);
		}
		else {
			return comports.filter(x=>!matchComport);
		}
	}

	/* 	saveData() {
		this.dbData.modelToAdd = {
			catComp: this.catCompeteSelected,
			subModels: [
				{
					nivel: this.comportCtl.nivSelected,
					competencia: this.comportCtl.compSelected,
					comportamientos: this.comportCtl.comportsSelected,
				},
			],
		};
		this.modelSV.save
	} */
}
