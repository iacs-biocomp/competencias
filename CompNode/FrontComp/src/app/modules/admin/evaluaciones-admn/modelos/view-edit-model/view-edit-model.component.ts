import { Component, Input, OnInit } from '@angular/core';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { ICatComp, ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';

type MiCompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;
type IModelPreDTO = Partial<IModelDTO> & Omit<IModelDTO, 'catComp'>;

type DbData = {
	/** listado de categorias competenciales */
	catComps: ICatComp[];
	/** listado de competencias */
	comps: ICompetencia[];
	/** listado de comportamientos */
	comports: IComportamiento[];
	/** listado de niveles */
	niveles: INivel[];
	/** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	modelToAdd: IModelPreDTO;
};
type ComportCtrlView = {
	//TODO: Tsdoc
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
};
type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;

/** Este componente esta destinado a la visualización y edición de un modelo, según que parametro se le pase mostrará o no el Añadir/Eliminar comportamiento */
@Component({
	selector: 'app-view-edit-model [test] [modoEdicion] ',
	templateUrl: './view-edit-model.component.html',
	styleUrls: ['./view-edit-model.component.css'],
})
export class ViewEditModelComponent implements OnInit {
	@Input() test!: string;
	modelEditShow!: IModelPreDTO;
	@Input() dbData!: DbData;
	@Input() modoEdicion!: boolean;

	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];

	/** Objeto que tiene los datos usados para los select */

	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
	};
	constructor() {}

	ngOnInit(): void {
		console.log(this.modelEditShow);
		console.log(this.dbData);
		this.competenciasSelect = this.getCompet(this.modelEditShow);
		console.log(this.competenciasSelect);
		this.modelEditShow = this.dbData.modelToAdd;
	}

	getCompet(model: IModelPreDTO): ICompetencia[] {
		const competencias = model.subModels.map(x => x.competencia!);
		return competencias.filter((compet, index) => competencias.findIndex(f => compet.id === f.id) === index);
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel) {
		const _model = this.modelEditShow;
		const subModel = this.findSubModel(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}
	/**
	 * @param subModels El array de submodelos en el que se busca el submodelo
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
	 */
	findSubModel(subModels: ISubModel[], comp: ICompetencia, niv: INivel): ISubModel | undefined {
		return subModels.find(subModel => subModel.competencia === comp && subModel.nivel === niv);
	}
	/**
	 * @param subModels El array de submodelos en el cual se buscaran el/los submodelo/s coincidente/s
	 * @param comp La competencia que se usará como filtrado
	 * @returns El array de subModelos que tienen esa competencia
	 */
	findSubModels(subModels: ISubModel[], comp: ICompetencia): ISubModel[] {
		return subModels.filter(subModel => subModel.competencia?.id === comp.id);
	}
}
