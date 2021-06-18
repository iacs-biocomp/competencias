import { Component, OnInit } from '@angular/core';
import { IOrganigramaEvDTO } from 'sharedInterfaces/DTO';

@Component({
	selector: 'app-eval-persona',
	templateUrl: './eval-persona.component.html',
	styleUrls: ['./eval-persona.component.scss'],
})
export class EvalPersonaComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {
		// this.takeCatComp();
	}

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

	/**
	 * Funcion para igualar la catcompetencial y buscar a los trabajadores con la
	 * misma catcomp que se va a evaluar
	 */
	// takeCatComp() {
	// 	for (let infer of this.organigramaExample.inferiores) {
	// 		if (this.organigramaExample.trabajador.catComp?.id === infer.catComp?.id) {
	// 			console.log(infer);
	// 			console.log(this.organigramaExample.inferiores);
	// 			return infer;
	// 		}
	// 	}
	// }
}
