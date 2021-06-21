import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrganigramaEvDTO } from 'sharedInterfaces/DTO';

/** Como se llama el parametro que identifica la evaluación a evaluar */
export const evId = 'evId'

@Component({
	selector: 'app-eval-persona',
	templateUrl: './eval-persona.component.html',
	styleUrls: ['./eval-persona.component.scss'],
})
export class EvalPersonaComponent implements OnInit {
	evId = this.route.snapshot.paramMap.get(evId)!;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {}

	display = false;

	organigramaExample: IOrganigramaEvDTO = {
		inferiores: [
			{
				dni: '90909096H',
				nombre: 'David',
				apellidos: 'Inferior Inferior',
				area: 'e',
				unidad: 'e',
				departamento: 'e',
				catComp: {
					id: 'GR8',
					description: 'g',
				},
			},
			{
				dni: '90909097H',
				nombre: 'Cristina',
				apellidos: 'Inferior Inferior',
				area: 'e',
				unidad: 'e',
				departamento: 'e',
				catComp: {
					id: 'GR8',
					description: 'g',
				},
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
			catComp: {
				id: 'GR8',
				description: 'd',
			},
		},
		propuestos: undefined,
	};
}
