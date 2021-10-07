import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EvModelsAdmnService } from 'services/data';
import { IEvModelGetDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { DbData } from 'src/app/types/data';
import { LogService } from 'src/app/shared/log/log.service';

type ViewProps = {
	/** Representa si hay modelos de referencia o no */
	haveModels: boolean;
};

type DbDataViewAllM = DbData & {
	modelToAdd: Omit<IEvModelGetDTO, 'id' | 'catComp'> & { catComp: ICatComp | undefined };
};
/**
 * Componente para ver todos los modelos creados y su informacion
 */
@Component({
	selector: 'app-view-all-models',
	templateUrl: './view-all-models.component.html',
	styleUrls: ['./view-all-models.component.scss'],
})
export class ViewAllModelsComponent implements OnInit {
	renderViewModels = false;
	refModels: IEvModelGetDTO[] = [];
	modoEdicion = false;
	dbData: DbDataViewAllM = {
		cComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
			reference: true,
		},
	};
	/** Objeto con propiedades usadas principalmente en la vista */
	viewProps?: ViewProps;
	evModelToShow = new BehaviorSubject<IEvModelGetDTO | undefined>(undefined);

	constructor(private readonly evModelSv: EvModelsAdmnService, private readonly logger: LogService) {}

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componte view-all-models');
		this.refModels = await this.evModelSv.getAllReference();
		this.viewProps = {
			haveModels: this.refModels.length !== 0,
		};
		if (!this.viewProps) {
			throw new Error('View Props no ha sido inicializado');
		}
		console.log(this);
	}
	evModelShowNotUndefined(
		subj: BehaviorSubject<IEvModelGetDTO | undefined>,
	): BehaviorSubject<IEvModelGetDTO> {
		if (!subj.value) {
			throw new Error(
				'Se ha llamado a la función de casteo cuando BehaviorSubject tenia valor interno undefined',
			);
		}
		return subj as BehaviorSubject<IEvModelGetDTO>;
	}

	async saveModel(model: IEvModelGetDTO) {
		this.logger.debug(`Actualizando modelo de referencia de ${model.catComp.id}`, { model });
		const hasBeenUpdated = await this.evModelSv.updateRefModel(model);
		if (!hasBeenUpdated) {
			alert('Contacte con un programador');
		} else {
			alert(`Actualizado modelo de ${model.catComp.id} correctamente`);
		}
	}
}
