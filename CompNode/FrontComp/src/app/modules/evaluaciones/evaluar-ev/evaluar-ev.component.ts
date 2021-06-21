import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionesService } from '../evaluaciones.service';
import { ICompetencia, IComportamiento, IValoracion } from 'sharedInterfaces/Entity';
import {
	IModelBasicIndxDTO,
	IOrganigramaEvDTO,
	ITrabajadorDTO,
	IValoracionDTO,
	IValoracionIndexadaDTO,
} from 'sharedInterfaces/DTO';

/** Como se llama el parametro que identifica la evaluación a evaluar */
export const dniId = 'dniId';

type EvCompetencia = {
	descripcion: string;
	comports: {
		[key: string]: {
			descripcion: string;
		};
	};
};
type CompsYComports = {
	id: string;
	descripcion: string;
	comports: IComportamiento[];
};
type EvaluarCtrlView = {
	compsYComports?: CompsYComports[];
};

@Component({
	selector: 'app-evaluar-ev',
	templateUrl: './evaluar-ev.component.html',
	styleUrls: ['./evaluar-ev.component.scss'],
})
export class EvaluarEvConcretaComponent implements OnInit {
	/** Array de valoraciones ya puestas; radioButtons con su valor ya marcado */
	currentVals: IValoracion[] | undefined;

	dniId = this.route.snapshot.paramMap.get(dniId)!;
	constructor(private route: ActivatedRoute, private evSv: EvaluacionesService) {}

	competencias?: ICompetencia[];
	trabajador: Partial<ITrabajadorDTO> = {};

	cv: EvaluarCtrlView = {};
	valoracion: Partial<IValoracionIndexadaDTO> = {};

	valEj01: IValoracionDTO = {
		evaluadoDni: '33213215134H',
		evaluadorDni: '3999999934H',
		valoraciones: [
			{
				compId: 'C1',
				puntuaciones: [
					{
						comportId: 'C1.1.3',
						puntuacion: 1,
					},
					{
						comportId: 'C1.1.4',
						puntuacion: 2,
					},
				],
			},
		],
	};

	valEj02: IValoracionDTO = {
		evaluadoDni: '33213215134H',
		evaluadorDni: '3999999934H',
		valoraciones: [
			{
				compId: 'C3',
				puntuaciones: [
					{
						comportId: 'C1.1.4',
						puntuacion: 1,
					},
					{
						comportId: 'C1.1.4',
						puntuacion: 2,
					},
				],
			},
		],
	};

	valoracionExample: Partial<IValoracionIndexadaDTO> = {
		evaluadoDni: '33213215134H',
		evaluadorDni: '3999999934H',
		valoraciones: {
			C1: {
				Co1: 2,
				Co3: 5,
			},
			C2: {
				Co1: 2,
				Co3: 5,
			},
		},
	};

	organigramaExample: IOrganigramaEvDTO = {
		inferiores: [
			{
				dni: '90909096H',
				nombre: 'David',
				apellidos: 'Inferior Inferior',
				area: 'e',
				unidad: 'e',
				departamento: 'e',
			},
		],
		pares: [
			{
				dni: '90909095H',
				nombre: 'Carlos',
				apellidos: 'Telleria',
				area: 'e',
				unidad: 'e',
				departamento: 'e',
			},
		],
		superiores: [],
		trabajador: {
			dni: '90909096H',
			nombre: 'KIKE',
			apellidos: 'Inferior Inferior',
			area: 'e',
			unidad: 'e',
			departamento: 'e',
		},
		propuestos: undefined,
	};

	evaluacion: IModelBasicIndxDTO = {
		id: 21,
		catComp: { id: 'GR1', description: 'Gr1 descripción' },
		comps: {
			C1: {
				descripcion: 'desc de la competencia1',
				comports: {
					Co1: {
						descripcion: 'dsadsaasd',
					},
					Co2: {
						descripcion: 'dsadsaasd',
					},
					Co3: {
						descripcion: 'dsadsaasd',
					},
					Co4: {
						descripcion: 'dsadsaasd',
					},
				},
			},
			C2: {
				descripcion: 'desc de la competencia2',
				comports: {
					Co3: {
						descripcion: 'dsadsaasd',
					},
					Co4: {
						descripcion: 'dsadsaasd',
					},
				},
			},
		},
	};

	ngOnInit(): void {
		this.competencias = this.getCompetenciasModel(this.evaluacion);
		this.cv.compsYComports = this.competencias.map(comp => ({
			id: comp.id,
			descripcion: comp.descripcion,
			comports: this.getComporCompetencia(comp.id),
		}));
	}

	/** Devuelve todas las competencias que hay dentro de una evaluacion*/
	getCompetenciasModel(model: IModelBasicIndxDTO): ICompetencia[] {
		const comps = model.comps;
		const competencias = Object.keys(comps).map<ICompetencia>(key => ({
			id: key,
			descripcion: comps[key].descripcion,
		}));
		console.log(competencias);
		return competencias;
	}

	/**
	 * Devuelve los comportamientos por cada competencia de una evaluacion
	 *
	 * @param idComp id de la competencia a buscar
	 */
	getComporCompetencia(idComp: string): IComportamiento[] {
		const compsIndx = this.evaluacion.comps;
		const comp = compsIndx[idComp];
		console.log(Object.keys(comp.comports));
		const comports: IComportamiento[] = [];
		Object.keys(comp.comports).forEach(key =>
			comports.push({ id: key, descripcion: comp.comports[key].descripcion }),
		);
		return comports;
	}

	/** Devuelve las evaluaciones de una persona por su dni
	 *
	 * @param dniEvaluado el dni de la persona a evaluar
	 */
	getEvaluacionesPorPersona(dniEvaluado: string) {
		/** De ese dni ver las evaluacion que tiene */
		/** Una evaluacion tiene un modelo y una categoria competencial, las personas
		 * tiene catCompetencial; */
		/** Buscar la catComp de ese dni? */
	}

	/** Guarda la evaluacion por persona (una evaluacion se puede modificar siempre que
	 * el plazo para evaluar esté activo) */
	saveEvaluacion() {}

	/**
	 *
	 */
	crearValoracion() {}
}
