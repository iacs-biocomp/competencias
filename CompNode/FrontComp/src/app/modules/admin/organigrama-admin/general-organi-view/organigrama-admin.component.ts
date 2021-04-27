import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrganigramaUsrDTO, ITrabOrgani } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { ICatComp } from 'sharedInterfaces/ICategorias';
import { OrganiService } from '../services/organi.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';

type modalTitles = 'Inferior' | 'Superior' | 'Par';
type ctlView = {
	/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
	modalWorker?: IOrganigramaUsrDTO;
	/** Los trabajadores que se quieren añadir como relación del modalWorker,
	 *  del modalTitle se obtiene que tipo de relación se añadirá */
	modalRelations: ITrabOrgani[];
	/** Strings permitidos como titulo del modal, usado también para saber que es lo que se quiere añadir (inf/sup/par) */
	modalTitle: modalTitles;
	/** Categoria competencial usada para filtrar el organigrama */
	cCompFilter?: ICatComp;
	[key: string]: any;
};
@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	@ViewChild('closeModal') closeModal!: ElementRef;

	/** El organigrama completo, cada elemento tiene el trabajador y sus (pares/inf/sup) */
	fullOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();
	/** Todas las categorias competenciales */
	cComps!: ICatComp[];

	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv: ctlView = {
		orgFilter: '',
		/** Usada para hacer collapse de todos los accordion o mostrarlos */
		showall: false,
		modalTitle: 'Par',
		cCompFilter: undefined,
		/** El filtro a aplicar sobre el organigrama, dado por el usuario en un <input> */
		modalFilter: '',
		modalWorker: undefined,
		modalRelations: [],
	};

	constructor(private orgSv: OrganiService, private cCompSv: CatCompetencialesService) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([this.syncView(), this.cCompSv.getAll()]);
		this.cComps = promises[1];
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
		//TODO: Refactor
		const index = this.cv.modalRelations.indexOf(wrk);
		if (index == -1) {
			this.cv.modalRelations.push(wrk);
		} else {
			this.cv.modalRelations.splice(index, 1);
		}
	}
	async syncView(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.fullOrgani.sort((a, b) => a.trabajador.nombre.localeCompare(b.trabajador.nombre));
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
		this.trabajadoresFiltered = this.trabajadores;
	}
	/**
	 * Guarda las relaciones de un trabajador de un tipo determinado (par/inf/sup)
	 */
	async saveRelations() {
		let saved = false;
		var relations: ITrabOrgani[];
		try {
			switch (this.cv.modalTitle) {
				case 'Inferior':
					relations = this.cv.modalRelations.concat(this.cv.modalWorker?.inferiores!);
					relations = relations.filter((rel, index) => relations.indexOf(rel) === index);
					saved = await this.orgSv.setInferiores(this.cv.modalWorker!.trabajador, relations);
					break;
				case 'Par':
					relations = this.cv.modalRelations.concat(this.cv.modalWorker?.pares!);
					relations = relations.filter((rel, index) => relations.indexOf(rel) === index);
					saved = await this.orgSv.setPares(this.cv.modalWorker!.trabajador, relations);
					break;
				case 'Superior':
					relations = this.cv.modalRelations.concat(this.cv.modalWorker?.superiores!);
					relations = relations.filter((rel, index) => relations.indexOf(rel) === index);
					saved = await this.orgSv.setSuperiores(this.cv.modalWorker!.trabajador, relations);
					break;
			}
		} catch (error) {
			alert('Contacte con un programador');
		}
		if (saved) {
			console.log('Guardado correctamente');
			// alert('Guardado correctamente');
		}
		this.closeModal.nativeElement.click();
		await this.syncView();
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
		let nameFilteredOrg = this.fullOrgani?.filter(org => {
			const trabNames = org.trabajador.nombre.toLowerCase() + org.trabajador.apellidos.toLowerCase();
			return trabNames.includes(filterValue) ? true : false;
		});
		if (!this.cv.cCompFilter) {
			return nameFilteredOrg;
		}
		return nameFilteredOrg.filter(org => org.trabajador.catComp?.id == this.cv.cCompFilter?.id);
	}
}
