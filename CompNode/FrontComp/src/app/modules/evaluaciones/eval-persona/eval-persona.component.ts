import { Component, OnInit } from '@angular/core';
import { IOrganigrama } from 'sharedInterfaces/DTO/IOrganigrama';

@Component({
	selector: 'app-eval-persona',
	templateUrl: './eval-persona.component.html',
	styleUrls: ['./eval-persona.component.scss'],
})
export class EvalPersonaComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	organigramaExample: IOrganigrama = {
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
}
