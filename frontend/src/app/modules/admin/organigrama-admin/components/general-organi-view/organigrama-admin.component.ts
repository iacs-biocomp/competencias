import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { uniqBy } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OrganiService, CatCompetencialesService } from 'services/data';
import { lowerCaseNoWhiteSpaces, toggleInArray } from 'sharedCode/Utility';
import { IOrganigramaUsrDTO, ITrabajadorDTO, ITrabOrganiDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

type OrgScrollOpts = {
	removeHighlight?: boolean;
};

enum ModalTitles {
	INF = 'Inferior',
	SUP = 'Superior',
	PAR = 'Par',
}

@Component({
	selector: 'app-organigrama-admin',
	templateUrl: './organigrama-admin.component.html',
	styleUrls: ['./organigrama-admin.component.scss'],
})
export class OrganiGeneralView implements OnInit, OnDestroy {
	/** Reference to close modal btn */
	@ViewChild('closeModal') closeModalAddRel!: ElementRef<HTMLButtonElement>;
	/** Reference to close modal btn */
	@ViewChild('closeModalDeleteRel') closeModalDeleteRel!: ElementRef<HTMLButtonElement>;

	/** El organigrama completo, cada elemento tiene el trabajador y sus (pares/inf/sup) */
	fullOrgani!: IOrganigramaUsrDTO[];
	/** El organigrama filtrado, este es el que ha de modificarse cuando cambien los valores a filtrar */
	filteredOrgani!: IOrganigramaUsrDTO[];
	/** List of all workers */
	workers: ITrabOrganiDTO[] = [];
	workersFiltered: ITrabOrganiDTO[] = [];
	myControl = new FormControl();
	/** Todas las categorias competenciales */
	cComps: ICatComp[] = [];

	/** Used only for the view to access enum members */
	ModalTitles = ModalTitles;

	/** Control View, objeto que tiene variables unicamente para la vista y se usan poco en el modelo */
	cv = {
		/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
		orgFilterObs: new BehaviorSubject(''),
		/** Representa el texto que se ha usado previamente para filtrar (orgFilterObs.value) */
		previousFilterTxt: '',
		/** Usada para hacer collapse de todos los accordion o mostrarlos */
		showall: false,
		/** Categoria competencial usada para filtrar el organigrama */
		cCompFilter: undefined as ICatComp | undefined,
		/** Categoria competencial usada para filtrar el organigrama */
		cCompFilterObs: new BehaviorSubject<ICatComp | undefined>(undefined),
		trabCount: 0,
		modal: {
			title: ModalTitles.PAR,
			/** El trabajador sobre el que se abre el modal al cual se le añadirá una relacion */
			worker: undefined as IOrganigramaUsrDTO | undefined,
			/** Los trabajadores que se quieren añadir como relación del modalWorker,
			 *  del modalTitle se obtiene que tipo de relación se añadirá */
			relations: [] as ITrabajadorDTO[],
			/** Relaciones de un trabajador a borrar en la base de datos, el modal las añade a este array al hacer click */
			relationsDelete: [] as ITrabajadorDTO[],
			/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
			filter: '',
			/** El filtro a aplicar sobre el organigrama en el MODAL, dado por el usuario en un <input> */
			filterObs: new BehaviorSubject(''),
			/** Organigrama del modal filtrado (Debe ser filtrado para el trabajador del modal y con el texto dado) */
			orgFiltered: [] as IOrganigramaUsrDTO[],
		},
	};
	#subs: Subscription[] = [];

	constructor(
		private readonly orgSv: OrganiService,
		private readonly cCompSv: CatCompetencialesService,
		private readonly logger: LogService,
	) {}

	ngOnInit(): void {
		this.logger.verbose('Inicializando componente organigrama-admin');
		(async () => {
			const [_, cComps] = await Promise.all([this.syncView(), this.cCompSv.getAll()]);
			this.cComps = cComps;
			this.filteredOrgani = this.filterOrgani('');

			this.#subs.push(
				//Suscripción 1
				this.cv.orgFilterObs.subscribe(txt4filter => {
					if (txt4filter === this.cv.previousFilterTxt) {
						return;
					}
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
				this.cv.cCompFilterObs.subscribe(() => {
					this.filteredOrgani = this.filterOrgani(this.cv.orgFilterObs.value);
				}),
			);
		})();
	}

	ngOnDestroy(): void {
		this.logger.verbose(`ngOnDestroy of ${this.constructor.name}`);
		this.#subs.forEach(s => s.unsubscribe());
		this.closeModalAddRel.nativeElement.click();
		this.closeModalDeleteRel.nativeElement.click();
	}

	/**
	 *
	 * @param modalWorker
	 * @param modalTitle El titulo del modal, de tipo modalTitles
	 */
	setCtrlView(modalWorker: IOrganigramaUsrDTO, modalTitle: ModalTitles, addOrRemove: 'remove' | 'add') {
		const relations = (): ITrabajadorDTO[] => {
			switch (modalTitle) {
				case ModalTitles.INF:
					return modalWorker.inferiores;
				case ModalTitles.SUP:
					return modalWorker.superiores;
				case ModalTitles.PAR:
					return modalWorker.pares;
			}
		};
		this.cv.modal.relations = addOrRemove === 'add' ? [] : relations();
		this.cv.modal.relationsDelete = [];
		this.cv.modal.worker = modalWorker;
		this.cv.modal.title = modalTitle;
	}

	selectRelation(wrk: typeof this.cv.modal.relationsDelete[0]) {
		toggleInArray(wrk, this.cv.modal.relations);
	}

	selectRelToRm(wrk: typeof this.cv.modal.relationsDelete[0]) {
		toggleInArray(wrk, this.cv.modal.relationsDelete);
	}

	/** Sincroniza la vista con la base de datos pidiendo todos los datos de nuevo */
	async syncView(): Promise<void> {
		this.fullOrgani = await this.orgSv.getFullOrgani();
		this.fullOrgani.sort((a, b) => a.trabajador.nombre.localeCompare(b.trabajador.nombre));
		this.workers = this.fullOrgani.map(org => org.trabajador);
		this.workersFiltered = this.workers;
		this.filteredOrgani = this.filterOrgani('');
		this.cv.modal.filterObs.next('');
	}

	/**
	 * Guarda las relaciones de un trabajador de un tipo determinado (par/inf/sup)
	 *
	 * @param dniId El identificador del elemento HTML al cual hay que volver una vez se sincronice la vista
	 */
	async saveRelations(dniId?: string) {
		let saved = false;
		let relations: ITrabajadorDTO[];
		/** Remove duplicate workers, comparing them by dni */
		const filterDuplicates = <T extends Pick<ITrabajadorDTO, 'dni'>>(rels: T[]): T[] => uniqBy(rels, 'dni');
		try {
			switch (this.cv.modal.title) {
				case ModalTitles.INF:
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker!.inferiores));
					this.logger.verbose('Guardando relaciones con inferiores');
					saved = await this.orgSv.setInferiores(this.cv.modal.worker!.trabajador, relations);
					break;
				case ModalTitles.PAR:
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker!.pares));
					this.logger.verbose('Guardando relaciones con pares');
					saved = await this.orgSv.setPares(this.cv.modal.worker!.trabajador, relations);
					break;
				case ModalTitles.SUP:
					relations = filterDuplicates(this.cv.modal.relations.concat(this.cv.modal.worker!.superiores));
					this.logger.verbose('Guardando relaciones con superiores');
					saved = await this.orgSv.setSuperiores(this.cv.modal.worker!.trabajador, relations);
					break;
			}
		} catch (error) {
			alert('Contacte con un programador');
		}
		if (saved) {
			this.logger.verbose('Relaciones guardadas con éxito');
		}
		this.closeModalAddRel.nativeElement.click();
		await this.syncView();
		if (!dniId) {
			return;
		}
		this.scroll(dniId, {
			removeHighlight: true,
		});
	}

	async deleteRelations(dniId?: string) {
		const trabajador = this.cv.modal.worker?.trabajador;
		if (!trabajador) {
			return;
		}
		try {
			switch (this.cv.modal.title) {
				case ModalTitles.INF:
					await this.orgSv.deleteInferiores(trabajador, this.cv.modal.relationsDelete);
					break;
				case ModalTitles.SUP:
					await this.orgSv.deleteSuperiores(trabajador, this.cv.modal.relationsDelete);
					break;
				case ModalTitles.PAR:
					await this.orgSv.deletePares(trabajador, this.cv.modal.relationsDelete);
					break;
			}
		} catch (err) {
			alert('Contacte con un programador');
		}
		this.closeModalDeleteRel.nativeElement.click();
		await this.syncView();
		if (!dniId) {
			return;
		}
		this.scroll(dniId, {
			removeHighlight: true,
		});
	}

	/**
	 * Función que aplica una animación css (Clase highlight) y hace scroll hasta ver en pantalla el elemento dado.
	 *
	 * @param id Id del elemento HTML al que se quiere hacer scroll
	 */
	scroll(id: string, scrollOpts?: OrgScrollOpts): void {
		const element = document.getElementById(id);
		if (!element) {
			console.error(`No element to scroll with id: ${id}`);
			return;
		}
		if (!scrollOpts?.removeHighlight) {
			element.classList.add('highlight');
			setTimeout(() => {
				element.classList.remove('highlight');
			}, 1500);
		}
		element.scrollIntoView();
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
		this.logger.debug(`Buscando catComp con id: ${id}`);
		return this.cComps.find(c => c.id === id);
	}

	/**
	 * Metodo que filtra el organigrama, NO lo modifica, retorna el valor filtrado
	 *
	 * @param value El valor a usar como filtro
	 * @returns Un organigrama filtrado de tipo IOrganigramaUsrDTO
	 */
	filterOrgani(value: string): IOrganigramaUsrDTO[] {
		this.logger.verbose('Filtrando orgranigrama');
		const filterValue = lowerCaseNoWhiteSpaces(value);
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
