import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrganigramaUsrDTO, ITrabOrgani } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { OrganiService } from '../services/organi.service';

type modalTitles = 'Inferior' | 'Superior' | 'Par';
type ctlView = {
	/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
	modalWorker?: IOrganigramaUsrDTO;
	/** Los trabajadores que se quieren añadir como relación del modalWorker,
	 *  del modalTitle se obtiene que tipo de relación se añadirá */
	modalRelations: ITrabOrgani[];
	/** Strings permitidos como titulo del modal, usado también para saber que es lo que se quiere añadir (inf/sup/par) */
	modalTitle: modalTitles;
	[key: string]: any;
};
@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	/** El organigrama completo, cada elemento tiene el trabajador y sus (pares/inf/sup) */
	fullOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();

	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv: ctlView = {
		orgFilter: '',
		/** Usada para hacer collapse de todos los accordion o mostrarlos */
		showall: false,
		modalTitle: 'Par',
		/** El filtro a aplicar sobre el organigrama, dado por el usuario en un <input> */
		modalFilter: '',
		modalWorker: undefined,
		modalRelations: [],
	};

	constructor(private orgSv: OrganiService) {}

	async ngOnInit(): Promise<void> {
		await this.syncView();
		setInterval(() => {
			console.log(this.cv.modalRelations);
		}, 5000);
	}

	/**
	 *
	 * @param modalWorker
	 * @param modalTitle El titulo del modal, de tipo modalTitles
	 */
	setCtrlView(modalWorker: IOrganigramaUsrDTO, modalTitle: modalTitles) {
		this.cv.modalRelations = [];
		this.cv.modalWorker = modalWorker;
		this.cv.modalTitle = modalTitle;
	}

	selectRelation(wrk: ITrabOrgani, listItemId: string) {
		const listItem = document.getElementById(listItemId);
		if (listItem == null) {
			console.log('Contacte con un programador');
			return;
		}
		const index = this.cv.modalRelations.indexOf(wrk);

		if (index == -1) {
			this.cv.modalRelations.push(wrk);
		} else {
			this.cv.modalRelations.splice(index, 1);
		}
	}
	async syncView(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
		this.trabajadoresFiltered = this.trabajadores;
	}
	/**
	 * Guarda las relaciones de un trabajador de un tipo determinado (par/inf/sup)
	 */
	async saveRelations() {
		let saved = false;
		try {
			switch (this.cv.modalTitle) {
				case 'Inferior':
					saved = await this.orgSv.setInferiores(this.cv.modalWorker!.trabajador, this.cv.modalRelations);
					break;
				case 'Par':
					saved = await this.orgSv.setPares(this.cv.modalWorker!.trabajador, this.cv.modalRelations);
					break;
				case 'Superior':
					saved = await this.orgSv.setSuperiores(this.cv.modalWorker!.trabajador, this.cv.modalRelations);
					break;
			}
		} catch (error) {
			alert('Contacte con un programador');
		}
		if (saved) {
			alert('Guardado correctamente');
		}
		this.syncView();
	}

	/**
	 * Función que aplica una animación css (Clase highlight) y hace scroll hasta ver en pantalla el elemento dado.
	 * @param id Id del elemento HTML al que se quiere hacer scroll
	 */
	scroll(id: string) {
		const element = document.getElementById(id);
		element?.classList.add('highlight');
		element?.scrollIntoView();
		setTimeout(() => {
			element?.classList.remove('highlight');
		}, 1500);
	}

	/**
	 * Filtra un organigrama eliminando las relaciones (sup/inf/pares) y al propio trabajador,
	 * para mostrar en la vista los trabajadores que se pueden añadir al organigrama de ese trabajador
	 *
	 * @param organi Organigrama a filtrar
	 * @param worker Trabajador que posee los arrays de inferiores superiores etc.
	 * @returns El organigrama filtrado, sin sup/inf/pares ni el propio trabajador
	 */
	filterNewRelation(organi: IOrganigramaUsrDTO[], worker: IOrganigramaUsrDTO): IOrganigramaUsrDTO[] {
		// Se quitan posibles undefined
		if (!worker) {
			return organi;
		}
		//Se filtra usando el dni ya que comparando objetos da problemas.
		const dnisRelaciones: string[] = [
			...worker.inferiores,
			...worker.pares,
			...worker.superiores,
			worker.trabajador,
		].map(r => r.dni);
		return organi.filter(x => !dnisRelaciones.includes(x.trabajador.dni));
	}

	/**
	 * Metodo que filtra el organigrama, NO lo modifica, retorna el valor filtrado
	 * @param value El valor a usar como filtro
	 * @returns Un organigrama filtrado de tipo IOrganigramaUsrDTO
	 */
	filterOrgani(value: string): IOrganigramaUsrDTO[] {
		const filterValue = value.toLowerCase().replace(/\s/g, '');
		return this.fullOrgani?.filter(org => {
			const trabNames = org.trabajador.nombre.toLowerCase() + org.trabajador.apellidos.toLowerCase();
			return trabNames.includes(filterValue) ? true : false;
		});
	}
}
