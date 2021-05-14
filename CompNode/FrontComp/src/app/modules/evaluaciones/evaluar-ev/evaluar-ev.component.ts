import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { EvaluacionesService } from '../evaluaciones.service';
import { IModelBasicIndxDTO } from '../../../../../../interfaces/DTO';
export const evId = 'evId';

@Component({
	selector: 'app-evaluar-ev',
	templateUrl: './evaluar-ev.component.html',
	styleUrls: ['./evaluar-ev.component.css'],
})
export class EvaluarEvConcretaComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;
	constructor(private route: ActivatedRoute, private evSv: EvaluacionesService) {}

	evaluacion: IModelBasicIndxDTO = {
		id: '21',
		catComp: { id: 'GR1', description: 'Gr1 descripción' },
		comps: {
			C1: {
				descripcion: 'desc de la c1',
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
				descripcion: 'desc de la c2',
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
		if (evId) console.log(this.evId);
		this.evSv.evaluacionesUsr(this.evaluacion.id);
	}

	/** Devuelve todas las competencias que hay dentro de un modelo*/
	getCompetenciasModel() {
		const competencias = this.evaluacion.comps;
		return Object.keys(competencias).map(key => competencias[key]);
	}
}
