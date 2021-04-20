import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrganigramaUsrDTO, ITrabOrgani } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { OrganiService } from '../services/organi.service';

type ctlView = {
	/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
	modalWorker?: IOrganigramaUsrDTO;
	/** Los trabajadores que se quieren añadir como relación del modalWorker,
	 *  del modalTitle se obtiene que tipo de relación se añadirá */
	modalRelations: ITrabOrgani[];
	modalTitle: 'Inferior' | 'Superior' | 'Par';
	[key: string]: any;
};
@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	fullOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();
	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv: ctlView = {
		orgFilter: '',
		showall: false,
		modalTitle: 'Par',
		modalFilter: '',
		modalWorker: undefined,
		modalRelations: [],
	};

	constructor(private orgSv: OrganiService) {}

	async ngOnInit(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
		this.trabajadoresFiltered = this.trabajadores;
		setInterval(() => {
			console.log(this.cv.modalRelations);
		}, 3000);
	}

	selectRelation(wrk: ITrabOrgani, listItemId: string) {
		const listItem = document.getElementById(listItemId);
		if (listItem == null) {
			console.log('Contacte con un programador');
			return;
		}
		const index = this.cv.modalRelations.indexOf(wrk);
		if (index == -1) {
			listItem.classList.add('active');
			this.cv.modalRelations.push(wrk);
		} else {
			listItem.classList.remove('active');
			this.cv.modalRelations.splice(index, 1);
		}
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
