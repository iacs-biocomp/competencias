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
};

type MiCompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;

type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia
} & IComportamiento;

@Component({
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
	/** Objeto que tiene los datos usados para los <select> */
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
	};

	/** Guarda la lista de competencias seleccionadas */
	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];


	/** Modelo a guardar en la bbdd, es la 'referencia' */
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
		setInterval(() => console.log(this.competenciasSelect), 2500);
		setInterval(() => console.log(this.comportamientosSelect), 2500);
	}

	/** Selecciona la cat competen del modelo */
	selectCatComp(catComp: ICatComp) {
		var index = this.addModelo.catComp;
		if (index) {
			this.addModelo.catComp = catComp;
			console.log(this.addModelo.catComp);
		}
	}

	/** Selecciona las competencias del submodelo */
	selectCompet(compete: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compete);
		if (index == -1) {
			this.competenciasSelect.push(compete);
			this.dbData.comps[index] = compete;
		} else {
			this.competenciasSelect.splice(index, 1);
		}
	}

	/** Selecciona los comportamientos del submodelo */
	selectComportamiento(comport: IComportamiento){
		const index = this.comportamientosSelect.indexOf(comport);
		if (index == -1) {
			this.comportamientosSelect.push(comport);
			this.dbData.comports[index] = comport;
		} else {
			this.comportamientosSelect.splice(index, 1)
		}
	}

	/** Selecciona el nivel objetivo de cada competencia */
	selectNivelObjetivo(nivel: INivel, compet: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compet);
		this.competenciasSelect[index].nivObjetivo = nivel;
	}

	saveComport(compet: ICompetencia, nivel: INivel, comport: IComportamiento){
		const index = this.comportamientosSelect.indexOf(comport);
		this.comportamientosSelect[index].competencia = compet;
		this.comportamientosSelect[index].nivel = nivel;
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

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comport: IComportamiento): void {
		let matchSubModel = this.addModelo.subModels.find(
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
