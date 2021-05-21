import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionesService } from '../evaluaciones.service';
import { ICompetencia, IComportamiento } from 'sharedInterfaces/Entity';
import { IModelBasicIndxDTO, ITrabajadorDTO, IValoracionIndexadaDTO } from 'sharedInterfaces/DTO';
export const evId = 'evId';

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
	styleUrls: ['./evaluar-ev.component.css'],
})
export class EvaluarEvConcretaComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;
	constructor(private route: ActivatedRoute, private evSv: EvaluacionesService) {}
	competencias?: ICompetencia[];
	trabajador: Partial<ITrabajadorDTO> = {};

	cv: EvaluarCtrlView = {};
	valoracion: Partial<IValoracionIndexadaDTO> = {};

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

	evaluacion: IModelBasicIndxDTO = {
		id: '21',
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
		this.evSv.evaluacionesUsr(this.evaluacion.id);
		this.competencias = this.getCompetenciasModel(this.evaluacion);
		this.cv.compsYComports = this.competencias.map(comp => {
			return { id: comp.id, descripcion: comp.descripcion, comports: this.getComporCompetencia(comp.id) };
		});
	}

	/** Devuelve todas las competencias que hay dentro de una evaluacion*/
	getCompetenciasModel(model: IModelBasicIndxDTO): ICompetencia[] {
		const comps = model.comps;
		const competencias = Object.keys(comps).map<ICompetencia>(key => {
			return { id: key, descripcion: comps[key].descripcion };
		});
		console.log(competencias);
		return competencias;
	}

	/** Devuelve los comportamientos por cada competencia de una evaluacion
	 * @param idComp id de la competencia a buscar
	 */
	getComporCompetencia(idComp: string) {
		const compsIndx = this.evaluacion.comps;
		const comp = compsIndx[idComp];
		console.log(Object.keys(comp.comports));
		let comports: IComportamiento[] = [];
		Object.keys(comp.comports).forEach(key =>
			comports.push({ id: key, descripcion: comp.comports[key].descripcion }),
		);
		return comports;
	}

	/** Devuelve las evaluaciones de una persona por su dni
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
}
