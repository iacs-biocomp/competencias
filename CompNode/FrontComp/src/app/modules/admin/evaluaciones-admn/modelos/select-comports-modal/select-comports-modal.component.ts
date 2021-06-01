import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';
import { BehaviorSubject } from 'rxjs';
import { IModelDTO } from 'sharedInterfaces/DTO';
import { WithOptional } from 'sharedInterfaces/Utility';
import { ComportService } from '../../../comportamientos-admin/services/comport.service';

type IModelPreDTO = Partial<IModelDTO> & {
	subModels: WithOptional<ISubModel, 'nivel'>[];
};
type ComportCtrlView = {
	/** La ultima competencia seleccionada */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
	comportDescObs: BehaviorSubject<string | undefined>;
};
export type DbData = {
	/** listado de comportamientos */
	comports: IComportamiento[];
	// /** listado de categorias competenciales */
	// catComps: ICatComp[];
	// /** listado de competencias */
	// comps: ICompetencia[];
	// /** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	// modelToAdd: IModelPreDTO;
};

@Component({
	selector: 'app-select-comports-modal [idModal] [comportsToShow] ',
	templateUrl: './select-comports-modal.component.html',
	styleUrls: ['./select-comports-modal.component.scss'],
})
export class SelectComportsModalComponent implements OnInit {
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
		comportDescObs: new BehaviorSubject<string | undefined>(undefined),
	};
	/** Objeto que tiene los datos usados para los select */
	dbData: DbData = {
		comports: [],
	};

	@Input() idModal!: string;
	/** Son los comportamientos que mostrará para seleccionar o borrar este componente */
	@Input() comportsToShow!: IComportamiento[];
	@Output() comports = new EventEmitter<IComportamiento[]>();

	constructor(private comportSv: ComportService) {}

	async ngOnInit(): Promise<void> {
		this.dbData.comports = await this.comportSv.getAll();
		setInterval(() => {
			console.log(this);
		}, 5000);
	}

	/** Selecciona los comportamientos que va tener el submodelo
	 *
	 * @param comport comportamiento seleccionado
	 */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected.indexOf(comport);
		if (index == -1) {
			arrToPush.push(comport);
		} else {
			arrToPush.splice(index, 1);
		}
	}
	/**Flush the "buffer" and moves the data into the model of type {@link IEvModel}*/
	addAllComports(): void {
		this.comports.emit(this.comportCtl.comportsSelected);
		this.comportCtl.comportsSelected = [];
	}
}
