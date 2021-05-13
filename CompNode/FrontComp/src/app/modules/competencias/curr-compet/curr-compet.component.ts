import { Component, OnInit } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';

@Component({
	selector: 'app-curr-compet',
	templateUrl: './curr-compet.component.html',
	styleUrls: ['./curr-compet.component.css'],
})
/**
 * Componente que muestra las competencias actuales que tiene un trabajador
 */
export class CurrCompetComponent implements OnInit {
	competencias!: ICompetencia[];
	constructor() {}

	ngOnInit(): void {}
}
