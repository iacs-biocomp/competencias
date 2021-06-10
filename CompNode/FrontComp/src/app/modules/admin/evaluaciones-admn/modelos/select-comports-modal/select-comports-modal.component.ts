import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ICompetencia, IComportamiento, INivel } from 'sharedInterfaces/Entity';
import { BehaviorSubject, Subscription } from 'rxjs';

type ComportCtrlView = {
	/** La ultima competencia seleccionada */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
	comportDescObs: BehaviorSubject<string>;
	//TODO: Tsdoc
	comportsFiltered: IComportamiento[];
};

type modalView = {
	/** Numero actual de comportamientos mostrando */
	numComportsMostrando: number;
	/** Cantidad de tuplas que se muestran cada vez que le damos a 'Mostrar más' */
	mostrarMas: number;
	/** Numero por el que empieza; siempre sera 0, se deja por si en un futuro se quiere modificar este valor*/
	start: number;
	/** Numero total de comportamientos que se iran mostrando (de 10 en 10) */
	end: number;
};
@Component({
	selector: 'app-select-comports-modal [idModal] [comportsToShowObs] ',
	templateUrl: './select-comports-modal.component.html',
	styleUrls: ['./select-comports-modal.component.scss'],
})
export class SelectComportsModalComponent implements OnInit, OnDestroy {
	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
		comportDescObs: new BehaviorSubject<string>(''),
		comportsFiltered: [],
	};

	cv: modalView = {
		numComportsMostrando: 10,
		mostrarMas: 10,
		start: 0,
		end: 10,
	};

	private cvDefault: modalView = {
		numComportsMostrando: 10,
		mostrarMas: 10,
		start: 0,
		end: 10,
	};

	@Input() idModal!: string;
	/** Son los comportamientos que mostrará para seleccionar o borrar este componente */
	@Input() comportsToShowObs = new BehaviorSubject<IComportamiento[]>([]);
	//TODO: Tsdoc
	@Output() comports = new EventEmitter<IComportamiento[]>();

	//TODO: Tsdoc
	subs: Subscription[] = [];

	async ngOnInit(): Promise<void> {
		setInterval(() => {
			console.log(this);
		}, 5000);
		this.subs.push(
			this.comportsToShowObs.subscribe(() => {
				this.comportCtl.comportsSelected = [];
				this.cv = { ...this.cvDefault };
				this.comportCtl.comportDescObs.next('');
			}),
			this.comportCtl.comportDescObs.subscribe(txt => {
				if (txt==='') {
					this.comportCtl.comportsFiltered = this.comportsToShowObs.value;
					return;
				}
				const filterValue = txt.toLowerCase().replace(/\s/g, '');
				this.comportCtl.comportsFiltered = this.comportsToShowObs.value.filter(comport =>
					comport.descripcion.toLowerCase().replace(/\s/g, '').includes(filterValue),
				);
			}),
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	/** Selecciona los comportamientos que va tener el submodelo
	 *
	 * @param comport comportamiento seleccionado
	 */
	selectComportamiento(comport: IComportamiento): void {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected.indexOf(comport);
		if (index === -1) {
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

	/** Al clicar en el boton 'Mostrar mas' se muestran 10 comportamientos mas a la vista  */
	showMoreComports(): number {
		this.cv.numComportsMostrando = this.cv.numComportsMostrando + this.cv.mostrarMas;
		this.cv.end = this.cv.numComportsMostrando;
		return this.cv.numComportsMostrando;
	}
}
