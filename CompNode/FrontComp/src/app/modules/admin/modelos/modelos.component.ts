import { Component, OnInit } from '@angular/core';
import { ICatComp } from '../../../../../../interfaces/ICategorias';
import { ICompetencia, IComportamiento, INivel, ISubModel } from '../../../../../../interfaces/IEvaluaciones';
import { IModelDTO } from '../../../../../../interfaces/DTO/IModelDTO';
import { CatCompetencialesService } from '../cat-admn/services/CatCompetenciales.service';
import { CompetenciasService } from '../competencias-admin/services/competencias.service';
import { ComportService } from '../comportamientos-admin/services/comport.service';
import { NivelService } from '../niveles-admin/services/nivel.service';

//Comps = competencias, comports = comportamientos
type DbData = {
	//TODO: Tsdoc
	catComps: ICatComp[];
	//TODO: Tsdoc
	comps: ICompetencia[];
	//TODO: Tsdoc
	comports: IComportamiento[];
	niveles: INivel[];
};
@Component({
	selector: 'app-modelos',
	templateUrl: './modelos.component.html',
	styleUrls: ['./modelos.component.css'],
})
export class ModelosComponent implements OnInit {
	//TODO: Tsdoc, objeto que tiene los datos usados para los select etc
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
	};

	niveles!: INivel[];
	enviado: boolean = false;
	competeFilter: string = '';
	//TODO: Tsdoc
	fullModel!: IModelDTO[];
	//TODO: Tsdoc
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

	//? ???????
	public selectedOption!: boolean;

	/* Estilo por defecto del boton*/
	bntStyle: string = 'btn-default';
	//? ???????
	current = 0;

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
	) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAllCompt(),
			this.nivSv.getAll(),
			this.comportSv.getAll(),
		]);
		this.dbData.catComps = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.dbData.comports = promises[3];
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

	newAsociacionCompeNivel() {}
	selectRelation() {}
	saveRelations() {}
	selectCompe() {}
}
