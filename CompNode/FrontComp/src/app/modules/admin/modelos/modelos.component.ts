import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import { ICompetencia, ISubModel } from '../../../../../../interfaces/IEvaluaciones';
import { ModelosService } from './services/modelos.service';

@Component({
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
	constructor(private modelService: ModelosService) {}

	current = 0;
	subModelToAdd!: ISubModel;
	catComps!: ICatComp[];
	competen!: ICompetencia[];
	subModel!: ISubModel[];
	public selectedOption!: boolean;

	/* Estilo por defecto del boton*/
	bntStyle: string = 'btn-default';

	move(derecha: boolean) {
		if (derecha && this.current < 2) {
			this.current++;
		}
		if (!derecha && this.current > 0) {
			this.current--;
		}
	}
	async ngOnInit(): Promise<void> {
		this.listCatComp();
		this.listCompeten();
		this.listSubModel();
	}

	async listCatComp(): Promise<void> {
		this.catComps = await this.modelService.getAllCatComp();
	}

	async listCompeten(): Promise<void> {
		this.competen = await this.modelService.getAllCompeten();
	}

	async listSubModel(): Promise<void> {
		this.subModel = await this.modelService.getAllSubModel();
	}

	/* Cuando se pulsa una opcion la ventana hace scroll hasta el botón de 'siguiente'*/
	scrollToButton(element: HTMLElement) {
		element.scrollIntoView();
		this.selectedOption = true;
	}

	/* Funcion para que cuando se haga click, cambie el estilo de los botones y haga la transición */
	submit() {
		this.bntStyle = 'btn-change';
	}
}
