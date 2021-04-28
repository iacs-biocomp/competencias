import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import { ICompetencia, IComportamiento, INivel, ISubModel } from '../../../../../../interfaces/IEvaluaciones';
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
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
	) {}

	catComps!: ICatComp[];
	competencs!: ICompetencia[];
	comports!: IComportamiento[];
	niveles!: INivel[];
	enviado: boolean = false;
	competeFilter: string = '';
	fullModel!: IModelDTO[];
	competenciasSelect: ICompetencia[] = [];
	addModelo: IModelDTO = {
		catComp: {
			id: 'CR6',
			description: 'CatComp 6',
		},
		subModels: [
			{
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

	public selectedOption!: boolean;
	/* Estilo por defecto del boton*/
	bntStyle: string = 'btn-default';
	current = 0;

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAllCompt(),
			this.nivSv.getAll(),
			this.comportSv.getAll(),
		]);
		this.catComps = promises[0];
		this.competencs = promises[1];
		this.niveles = promises[2];
		this.comports = promises[3];
		setInterval(() => {
			console.log(this.competenciasSelect);
		}, 2500);
	}

	selectCatComp(catComp: ICatComp) {
		var index = this.addModelo.catComp;
		if (index) {
			this.addModelo.catComp = catComp;
			console.log(this.addModelo.catComp);
		}
	}

	selectCompet(compete: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compete);
		if (index == -1) {
			this.competenciasSelect.push(compete);
		} else {
			this.competenciasSelect.splice(index, 1);
		}
	}

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
