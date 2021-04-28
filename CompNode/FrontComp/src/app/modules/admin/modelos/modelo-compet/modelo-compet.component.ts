import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-modelos',
	templateUrl: './modelo-compet.component.html',
	styleUrls: ['../modelos.component.css'],
})
//? No se usa (la carpeta entera), sirve?
export class ModeloCompetComponent implements OnInit {
	constructor() {}

	bntStyle: string = 'btn-default';
	current = 0;

	//? No se usa, sirve?
	/* Funcion para que cuando se haga click, cambie el estilo de los botones y haga la transición */
	submit() {
		this.bntStyle = 'btn-change';
	}

	move(derecha: boolean) {
		if (derecha && this.current < 2) {
			this.current++;
		}
		if (!derecha && this.current > 0) {
			this.current--;
		}
	}

	ngOnInit(): void {}
}
