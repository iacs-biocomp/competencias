import { Component, OnInit } from '@angular/core';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { ICatComp, ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';

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
	modelEditShow: IModelPreDTO;
};

@Component({
	selector: 'app-layout-test',
	templateUrl: './layout-test.component.html',
	styleUrls: ['./layout-test.component.scss'],
})
export class LayoutTestComponent implements OnInit {
	constructor() {
		console.log(this.dbData);
	}

	ngOnInit(): void {}

	dbData!: DbData;
	modelEditShow!: IModelPreDTO;
}
