import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrganigramaUsrDTO, ITrabOrgani } from 'sharedInterfaces/DTO/ITrabajadorDTO';
import { ICatComp } from 'sharedInterfaces/Entity/ICategorias';
import { OrganiService } from '../services/organi.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';

type ModalTitles = 'Inferior' | 'Superior' | 'Par';
type CtlView = {
	/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
	modalWorker?: IOrganigramaUsrDTO;
	/** Los trabajadores que se quieren añadir como relación del modalWorker,
	 *  del modalTitle se obtiene que tipo de relación se añadirá */
	modalRelations: ITrabOrgani[];
	/** Relaciones de un trabajador a borrar en la base de datos, el modal las añade a este array al hacer click */
	modalRelationsDelete: ITrabOrgani[];
	/** Strings permitidos como titulo del modal, usado también para saber que es lo que se quiere añadir (inf/sup/par) */
	modalTitle: ModalTitles;
	/** Categoria competencial usada para filtrar el organigrama */
	cCompFilter?: ICatComp;
	/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
	modalFilter: string;
	/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
	orgFilter: string;
	[key: string]: any;
};
@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit {
	@ViewChild('closeModal') closeModalAddRel!: ElementRef;
	@ViewChild('closeModalDeleteRel') closeModalDeleteRel!: ElementRef;

	/** El organigrama completo, cada elemento tiene el trabajador y sus (pares/inf/sup) */
	fullOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();
	/** Todas las categorias competenciales */
	cComps!: ICatComp[];

	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv: CtlView = {
		orgFilter: '',
		/** Usada para hacer collapse de todos los accordion o mostrarlos */
		showall: false,
		modalTitle: 'Par',
		cCompFilter: undefined,
		modalFilter: '',
		modalWorker: undefined,
		modalRelations: [],
		modalRelationsDelete: [],
		trabCount: 0,
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
	setCtrlView(modalWorker: IOrganigramaUsrDTO, modalTitle: ModalTitles, addOrRemove: 'remove' | 'add') {
		const relations = () => {
			switch (modalTitle) {
				case 'Inferior':
					return modalWorker.inferiores;
				case 'Superior':
					return modalWorker.superiores;
				case 'Par':
					return modalWorker.pares;
			}
		};
		this.cv.modalRelations = addOrRemove === 'add' ? [] : relations();
		this.cv.modalRelationsDelete = [];
		this.cv.modalWorker = modalWorker;
		this.cv.modalTitle = modalTitle;
	}

	selectRelation(wrk: ITrabOrgani) {
		const index = this.cv.modalRelations.indexOf(wrk);
		if (index === -1) {
			this.cv.modalRelations.push(wrk);
		} else {
			this.cv.modalRelations.splice(index, 1);
		}
	}
	selectRelToRm(wrk: ITrabOrgani) {
		const index = this.cv.modalRelationsDelete.indexOf(wrk);
		if (index === -1) {
			this.cv.modalRelationsDelete.push(wrk);
		} else {
			this.cv.modalRelationsDelete.splice(index, 1);
		}
	}
	/** Sincroniza la vista con la base de datos pidiendo todos los datos de nuevo */
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
		let relations: ITrabOrgani[];
		/**Funcion que recibe unos trabajadores y elimina los duplicados */
		const filterDuplicates = (rels: ITrabOrgani[]) =>
			rels.filter((rel, index) => rels.indexOf(rel) === index);
		try {
			switch (this.cv.modalTitle) {
				case 'Inferior':
					relations = filterDuplicates(this.cv.modalRelations.concat(this.cv.modalWorker?.inferiores!));
					saved = await this.orgSv.setInferiores(this.cv.modalWorker!.trabajador, relations);
					break;
				case 'Par':
					relations = filterDuplicates(this.cv.modalRelations.concat(this.cv.modalWorker?.pares!));
					saved = await this.orgSv.setPares(this.cv.modalWorker!.trabajador, relations);
					break;
				case 'Superior':
					relations = filterDuplicates(this.cv.modalRelations.concat(this.cv.modalWorker?.superiores!));
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
		this.closeModalAddRel.nativeElement.click();
		await this.syncView();
	}

	async deleteRelations() {
		let trabajador = this.cv.modalWorker?.trabajador;
		if (!trabajador) return;
		try {
			switch (this.cv.modalTitle) {
				case 'Inferior':
					await this.orgSv.deleteInferiores(trabajador, this.cv.modalRelationsDelete);
					break;
				case 'Superior':
					await this.orgSv.deleteSuperiores(trabajador, this.cv.modalRelationsDelete);
					break;
				case 'Par':
					await this.orgSv.deletePares(trabajador, this.cv.modalRelationsDelete);
					break;
			}
		} catch (err) {
			alert('Contacte con un programador');
		}
		this.closeModalDeleteRel.nativeElement.click();
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
		const nameFilteredOrg = this.fullOrgani?.filter(org => {
			const trabNames = org.trabajador.nombre.toLowerCase() + org.trabajador.apellidos.toLowerCase();
			return trabNames.includes(filterValue) ? true : false;
		});
		if (!this.cv.cCompFilter) {
			this.cv.trabCount = nameFilteredOrg?.length;
			return nameFilteredOrg;
		}
		const nameAndCCompFiltered = nameFilteredOrg.filter(
			org => org.trabajador.catComp?.id === this.cv.cCompFilter?.id,
		);
		//TODO: Refactor, mejor usar 2 observables para ver si ha cambiado el string a filtrar o la cComp y cambiar una variable OrgFiltered.
		this.cv.trabCount = nameAndCCompFiltered.length;
		return nameAndCCompFiltered;
	}
}
