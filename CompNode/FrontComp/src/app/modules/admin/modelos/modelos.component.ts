import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import {
	ICompetencia,
	IComportamiento,
	IEvModel,
	INivel,
	ISubModel,
} from '../../../../../../interfaces/IEvaluaciones';
import { IModelDTO } from '../../../../../../interfaces/DTO/IModelDTO';
import { CatCompetencialesService } from '../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../competencias-admin/services/competencias.service';
import { ComportService } from '../comportamientos-admin/services/comport.service';
import { NivelService } from '../niveles-admin/services/nivel.service';
import { ModelosService } from './services/modelos.service';

@Component({
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
	constructor(
		private modelService: ModelosService,
		private catCompService: CatCompetencialesService,
		private competenciasService: CompetenciasService,
		private nivelesService: NivelService,
		private comportamiService: ComportService,
	) {}

	catComps!: ICatComp[];
	competencs!: ICompetencia[];
	comports!: IComportamiento[];
	niveles!: INivel[];
	enviado: boolean = false;
	addModelo: IModelDTO = {
		catComp: {
			id: 'CR6',
			description: 'f',
		},
		subModels: [],
	};

	subModel!: ISubModel[];

	public selectedOption!: boolean;
	/* Estilo por defecto del boton*/
	bntStyle: string = 'btn-default';
	current = 0;

	async ngOnInit(): Promise<void> {
		this.catComps = await this.catCompService.getAll();
		this.competencs = await this.competenciasService.getAllCompt();
		this.niveles = await this.nivelesService.getAll();
		this.comports = await this.comportamiService.getAll();
	}

	selectCatComp(catComp: ICatComp) {
		if (catComp) {
			this.addModelo.catComp = catComp;
			console.log(this.addModelo);
		}
	}

	selectCompet(compete: ICompetencia, listItemId: string) {
		const listItem = document.getElementById(listItemId);
		if (listItem == null) {
			console.log('Error, contacte con un programador');
			return;
		}
		const index = this.competencs.indexOf(compete);
		console.log(index);
		var arrayCompetencias!: ICompetencia[];

		if (index == -1) {
			listItem.classList.add('active');
			arrayCompetencias.push(compete);
			console.log(arrayCompetencias);
		} else {
			listItem.classList.remove('active');
			arrayCompetencias.splice(index, 1);
			console.log(arrayCompetencias);
		}
	}

	/* Cuando se pulsa una opcion la ventana hace scroll hasta el botón de 'siguiente' */
	scrollToButton(element: HTMLElement) {
		element.scrollIntoView();
		this.selectedOption = true;
	}

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
}
