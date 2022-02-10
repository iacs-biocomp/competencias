import { Component } from '@angular/core';
import { ICompetencia } from 'sharedInterfaces/Entity';

/**
 * Componente que muestra las competencias actuales que tiene un trabajador
 */
@Component({
	selector: 'app-curr-compet',
	templateUrl: './curr-compet.component.html',
	styleUrls: ['./curr-compet.component.scss'],
})
export class CurrCompetComponent {
	competencias?: ICompetencia[];
}
