import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import {
	ICompetencia,
	IComportamiento,
	INivel,
	ISubModel,
} from '../../../../../../interfaces/IEvaluaciones';
import { IModelDTO } from '../../../../../../interfaces/DTO/IModelDTO';
import { CatCompetencialesService } from '../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../competencias-admin/services/competencias.service';
import { ComportService } from '../comportamientos-admin/services/comport.service';
import { NivelService } from '../niveles-admin/services/nivel.service';
@Component({
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
	constructor(
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
	competeFilter: string = '';

	addModelo: IModelDTO = {
		catComp: {
			id: 'CR6',
			description: 'CatComp 6',
		},
		subModels: [
			{
				modelos: [
					{
						id: 'M1',
						catComp: undefined,
						subModels: undefined,
					},
				],
				competencia: {
					id: 'C2',
					descripcion: 'Liderazgo',
					createdAt: undefined,
				},
				comportamientos: [
					{
						id: 'c04',
						descripcion: 'ooo',
						subModels: undefined,
					},
				],
				nivel: {
					id: 'N1',
					valor: 1,
					subModels: undefined,
				},
			},
		],
	};

	subModel: ISubModel = {
		modelos: undefined,
		nivel: {
			id: 'N1',
			valor: 1,
			subModels: undefined,
		},
		competencia: {
			id: 'C01',
			descripcion: 'COMP1',
			createdAt: undefined,
		},
		comportamientos: [
			{
				id: 'C01',
				descripcion: 'COMP1',
				subModels: undefined,
			},
		],
	};

	fullModel!: IModelDTO[];

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
		var index = this.addModelo.catComp;
		if (index) {
			this.addModelo.catComp = catComp;
			console.log(this.addModelo.catComp);
		}
	}

	/* 	selectCompet(compete: ICompetencia[], listItemId: string) {
		const listItem = document.getElementById(listItemId);
		if (listItem == null) {
			console.log('Contacte con un programador');
			return;
		}

		for (let i = 0; i <= compete.length; i++) {
			const index = this.competencs.indexOf(compete[i]);

			if (index == -1) {
				this.subModel.competencia = compete[i];
				console.log((this.subModel.competencia = compete[i]));
			} else {
				this.addModelo.subModels.splice(index, 1);
				console.log(this.addModelo.subModels.splice(index, 1));
			}
		}
	} */

	selectNivel(nivel: INivel) {
		var index = this.subModel.nivel;
		if (index) {
			this.subModel.nivel = nivel;
			console.log(this.subModel.nivel);
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

	newAsociacionCompeNivel() {}
	selectRelation() {}
	saveRelations() {}
	selectCompe() {}
}
