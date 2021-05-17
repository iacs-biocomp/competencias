import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrganiService } from '../services/organi.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { IOrganigramaUsrDTO, ITrabOrgani } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { BehaviorSubject, Subscription } from 'rxjs';

type ModalTitles = 'Inferior' | 'Superior' | 'Par';
type ModalCtrl = {
	/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
	worker?: IOrganigramaUsrDTO;
	/** Los trabajadores que se quieren añadir como relación del modalWorker,
	 *  del modalTitle se obtiene que tipo de relación se añadirá */
	relations: ITrabOrgani[];
	/** Relaciones de un trabajador a borrar en la base de datos, el modal las añade a este array al hacer click */
	relationsDelete: ITrabOrgani[];
	/** Strings permitidos como titulo del modal, usado también para saber que es lo que se quiere añadir (inf/sup/par) */
	title: ModalTitles;
	/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
	filter: string;
	/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
	filterObs: BehaviorSubject<string>;
	/** Organigrama del modal filtrado (Debe ser filtrado para el trabajador del modal y con el texto dado) */
	orgFiltered: IOrganigramaUsrDTO[];
};

type CtlView = {
	modal: ModalCtrl;

	/** Categoria competencial usada para filtrar el organigrama */
	cCompFilter?: ICatComp;
	/** Categoria competencial usada para filtrar el organigrama */
	cCompFilterObs: BehaviorSubject<ICatComp | undefined>;

	/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
	orgFilterObs: BehaviorSubject<string>;
	/** Representa el texto que se ha usado previamente para filtrar (orgFilterObs.value) */
	previousFilterTxt: string;
	[key: string]: any;
};
@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.css'],
})
export class OrganiGeneralView implements OnInit, OnDestroy {
	@ViewChild('closeModal') closeModalAddRel!: ElementRef;
	@ViewChild('closeModalDeleteRel') closeModalDeleteRel!: ElementRef;

	/** El organigrama completo, cada elemento tiene el trabajador y sus (pares/inf/sup) */
	fullOrgani!: IOrganigramaUsrDTO[];
	/** El organigrama filtrado, este es el que ha de modificarse cuando cambien los valores a filtrar */
	filteredOrgani!: IOrganigramaUsrDTO[];
	/** Lista de los trabajadores que hay en el fullOrgani*/
	trabajadores!: ITrabOrgani[];
	trabajadoresFiltered!: ITrabOrgani[];
	myControl = new FormControl();
	/** Todas las categorias competenciales */
	cComps!: ICatComp[];

	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv: CtlView = {
		orgFilterObs: new BehaviorSubject<string>(''),
		previousFilterTxt: '',
		/** Usada para hacer collapse de todos los accordion o mostrarlos */
		showall: false,
		cCompFilter: undefined,
		cCompFilterObs: new BehaviorSubject<ICatComp | undefined>(undefined),

		trabCount: 0,
		modal: {
			title: 'Par',
			worker: undefined,
			relations: [],
			relationsDelete: [],
			filter: '',
			filterObs: new BehaviorSubject<string>(''),
			orgFiltered: [],
		},
	};
	subs: Subscription[] = [];

	constructor(private orgSv: OrganiService, private cCompSv: CatCompetencialesService) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([this.syncView(), this.cCompSv.getAll()]);
		this.cComps = promises[1];
		this.filteredOrgani = this.filterOrgani('');

		this.subs.push(
			//Suscripción 1
			this.cv.orgFilterObs.subscribe(txt4filter => {
				if (txt4filter === this.cv.previousFilterTxt) return;
				this.filteredOrgani = this.filterOrgani(txt4filter);
				this.cv.previousFilterTxt = txt4filter;
			}),
			//Suscripción 2
			this.cv.modal.filterObs.subscribe(modalFilterTxt => {
				this.cv.modal.orgFiltered = this.filterNewRelation(
					this.filterOrgani(modalFilterTxt),
					this.cv.modal.worker!,
				);
			}),
			this.cv.cCompFilterObs.subscribe(cComp => {
				this.filteredOrgani = this.filterOrgani(this.cv.orgFilterObs.value);
			}),
		);
	}

	ngOnDestroy(): void {
		this.subs.forEach(s => s.unsubscribe());
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
		this.cv.modal.relations = addOrRemove === 'add' ? [] : relations();
		this.cv.modal.relationsDelete = [];
		this.cv.modal.worker = modalWorker;
		this.cv.modal.title = modalTitle;
	}

	selectRelation(wrk: ITrabOrgani) {
		const index = this.cv.modal.relations.indexOf(wrk);
		if (index === -1) {
			this.cv.modal.relations.push(wrk);
		} else {
			this.cv.modal.relations.splice(index, 1);
		}
	}
	selectRelToRm(wrk: ITrabOrgani) {
		const index = this.cv.modal.relationsDelete.indexOf(wrk);
		if (index === -1) {
			this.cv.modal.relationsDelete.push(wrk);
		} else {
			this.cv.modal.relationsDelete.splice(index, 1);
		}
	}
	/** Sincroniza la vista con la base de datos pidiendo todos los datos de nuevo */
	async syncView(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.fullOrgani.sort((a, b) => a.trabajador.nombre.localeCompare(b.trabajador.nombre));
		this.trabajadores = this.fullOrgani.map(org => org.trabajador);
		this.trabajadoresFiltered = this.trabajadores;
		this.filteredOrgani = this.filterOrgani('');
		this.cv.modal.filterObs.next('');
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
			switch (this.cv.modal.title) {
				case 'Inferior':
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker?.inferiores!));
					saved = await this.orgSv.setInferiores(this.cv.modal.worker!.trabajador, relations);
					break;
				case 'Par':
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker?.pares!));
					saved = await this.orgSv.setPares(this.cv.modal.worker!.trabajador, relations);
					break;
				case 'Superior':
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker?.superiores!));
					saved = await this.orgSv.setSuperiores(this.cv.modal.worker!.trabajador, relations);
					break;
			}
		} catch (error) {
			alert('Contacte con un programador');
		}
		if (saved) {
			console.log('Guardado correctamente');
		}
		this.closeModalAddRel.nativeElement.click();
		await this.syncView();
	}

	async deleteRelations() {
		let trabajador = this.cv.modal.worker?.trabajador;
		if (!trabajador) return;
		try {
			switch (this.cv.modal.title) {
				case 'Inferior':
					await this.orgSv.deleteInferiores(trabajador, this.cv.modal.relationsDelete);
					break;
				case 'Superior':
					await this.orgSv.deleteSuperiores(trabajador, this.cv.modal.relationsDelete);
					break;
				case 'Par':
					await this.orgSv.deletePares(trabajador, this.cv.modal.relationsDelete);
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

	findCatComp(id: string): ICatComp | undefined {
		return this.cComps.find(c => c.id === id);
	}

	/**
	 * Metodo que filtra el organigrama, NO lo modifica, retorna el valor filtrado
	 * @param value El valor a usar como filtro
	 * @returns Un organigrama filtrado de tipo IOrganigramaUsrDTO
	 */
	filterOrgani(value: string): IOrganigramaUsrDTO[] {
		console.log('filterOrganiCalled');
		const filterValue = value.toLowerCase().replace(/\s/g, '');
		const nameFilteredOrg = this.fullOrgani?.filter(org => {
			const trabNames = org.trabajador.nombre.toLowerCase() + org.trabajador.apellidos.toLowerCase();
			return trabNames.includes(filterValue) ? true : false;
		});
		if (!this.cv.cCompFilterObs.value) {
			this.cv.trabCount = nameFilteredOrg?.length;
			return nameFilteredOrg;
		}
		const nameAndCCompFiltered = nameFilteredOrg.filter(
			org => org.trabajador.catComp?.id === this.cv.cCompFilterObs.value?.id,
		);
		this.cv.trabCount = nameAndCCompFiltered.length;
		return nameAndCCompFiltered;
	}
}
