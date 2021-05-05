import { Component, OnInit } from '@angular/core';
import { ICatComp } from 'sharedInterfaces/ICategorias';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/IEvaluaciones';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { ComportService } from '../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../niveles-admin/services/nivel.service';

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
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
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
				console.log(c.nivObjetivo);
				if (!c.nivObjetivo) {
					valid = false;
				}
			});
			console.log(valid);
			return valid;
		},
	};

	/** Guarda la lista de competencias seleccionadas */
	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];

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
		setInterval(() => console.log(this.competenciasSelect), 5500);
	}

	/** Selecciona la cat competen del modelo */
	selectCatComp(catCompet: ICatComp) {
		if (catCompet) {
			this.dbData.modelToAdd.catComp = catCompet;
			console.log(this.dbData.modelToAdd.catComp);
		}
	}

	/** Selecciona las competencias del submodelo */
	selectCompet(compete: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compete);
		if (index == -1) {
			this.competenciasSelect.push(compete);
		} else {
			this.competenciasSelect.splice(index, 1);
		}
	}

	/** Selecciona los comportamientos del submodelo */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected!.indexOf(comport);
		if (index == -1) {
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
		this.comportCtl.comportsSelected.forEach(comport =>
			this.addComportToCompet(this.comportCtl.compSelected!, this.comportCtl.nivSelected!, comport),
		);
	}

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comport: IComportamiento): void {
		let matchSubModel = this.dbData.modelToAdd.subModels.find(
			x => x.competencia?.id === comp.id && x.nivel?.id === niv.id,
		);
		if (!matchSubModel) {
			matchSubModel = {
				nivel: niv,
				competencia: comp,
				comportamientos: [],
			};
		}
		const comportIndx = matchSubModel.comportamientos?.indexOf(comport);
		if (comportIndx === -1) {
			matchSubModel.comportamientos?.push(comport);
		}
		return;
	}
}
