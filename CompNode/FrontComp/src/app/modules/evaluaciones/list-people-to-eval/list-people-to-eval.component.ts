import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrganigramaEvDTO } from 'sharedInterfaces/DTO';

/** Como se llama el parametro que identifica la evaluación a evaluar */
export const evId = 'evId';

/**
 * TODO: Tsdoc de q hace el componente
 */
@Component({
	selector: 'app-list-people-to-eval',
	templateUrl: './list-people-to-eval.component.html',
	styleUrls: ['./list-people-to-eval.component.scss'],
})
export class ListPeopleToEvalComponent {
	evId = this.route.snapshot.paramMap.get(evId)!;

	constructor(private route: ActivatedRoute) {}

	/** Organigrama de ejemplo, luego el backend mandará algo similar */
	organigramaExample: IOrganigramaEvDTO = {
		trabajador: {
			dni: '90909095H',
			nombre: 'Carlos',
			apellidos: 'Telleria',
			area: 'e',
			unidad: 'e',
			departamento: 'e',
		},
		inferiores: [
			{
				dni: '90909093H',
				nombre: 'Adrian',
				apellidos: 'Molina',
				area: 'Biocomp',
				unidad: 'Unidad',
				departamento: 'Departamento',
			},
			{
				dni: '90909096H',
				nombre: 'David',
				apellidos: 'Inferior Inferior',
				area: 'e',
				unidad: 'e',
				departamento: 'e',
			},
			{
				dni: '90909094H',
				nombre: 'Cristina',
				apellidos: 'Izquierdo',
				area: 'Biocomp',
				unidad: 'Unidad',
				departamento: 'Departamento',
			},
			{
				dni: '90909092H',
				nombre: 'Manuel',
				apellidos: 'Cofrades',
				area: 'Biocomp',
				unidad: 'Unidad',
				departamento: 'Departamento',
			},
		],
		superiores: [],
		pares: [
			{
				dni: '90909091H',
				nombre: 'KIKE',
				apellidos: 'Superior Superior',
				area: 'Biocomp',
				unidad: 'Unidad',
				departamento: 'Departamento',
			},
		],
		propuestos: undefined,
	};
}
