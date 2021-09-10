import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvModelAddDTO, IEvModelGetDTO, IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { LogService } from 'src/app/shared/log/log.service';

/** Servicio crud para el manejo de los modelos de las evaluaciones */
@Injectable({ providedIn: 'root' })
export class EvModelsAdmnService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<IEvModelGetDTO[]> {
		const url = `${cnf.API_URL}/modelos`;
		this.logger.debug(`Obteniendo todos los modelos de evaluaciones de: ${url}`);
		return this.httpClient.get<IEvModelGetDTO[]>(url).toPromise();
	}

	/**
	 * @returns `Array` with all refence evModels
	 * TODO: DONE comprobar
	 */
	getAllReference(): Promise<IEvModelGetDTO[]> {
		const url = `${cnf.API_URL}/modelos/references`;
		this.logger.debug(`Obteniendo todos los modelos de referencia de: ${url}`);
		return this.httpClient.get<IEvModelGetDTO[]>(url).toPromise();
	}

	/**
	 * @param cComp The id from the catComp to get the reference
	 * @returns The reference model with the catComp selected
	 * TODO: DONE, comprobar
	 */
	getOneReference(cComp: Pick<ICatComp, 'id'> | ICatComp['id']): Promise<IEvModelGetDTO> {
		const cCompId = typeof cComp === 'string' ? cComp : cComp.id;
		const url = `${cnf.API_URL}/modelos/reference/${cCompId}`;
		this.logger.debug(
			`Obteniendo el modelo de referencia asociado a la cComp con ID: ${cCompId}, req a: ${url}`,
		);
		return this.httpClient.get<IEvModelGetDTO>(url).toPromise();
	}

	/**
	 *
	 * @param evModel The model to save
	 * @param reference `true` if it is a model reference, `false` if not
	 * @returns A `Promise` that it's `true` if it has been saved, exception if not
	 */
	save(evModel: IEvModelAddDTO, reference: boolean): Promise<IEvModelGetDTO> {
		// TODO: Cambiado a boolean, al serializar se queda true en vez de "true", comprobar en backend que es boolean con pipe
		const url = `${cnf.API_URL}/modelos`;
		this.logger.debug(`POST req a: ${url}, guardando el modelo, ¿es de referencia?: ${reference}`, evModel);
		return this.httpClient
			.post<IEvModelGetDTO>(url, evModel, { params: { reference: reference } })
			.toPromise();
	}

	/**
	 *
	 * @param refModel The reference model to update
	 * @returns A `Promise` that it's `true` if it has been updated, exception if not
	 * @throws TODO: complete
	 * TODO: DONE, testear
	 *
	 */
	updateRefModel(refModel: IEvModelAddDTO): Promise<true> {
		const url = `${cnf.API_URL}/modelos/reference`;
		this.logger.debug(`PUT req a: ${url}, actualizando datos del modelo:`, refModel);
		return this.httpClient.put<true>(url, refModel, { params: { reference: 'true' } }).toPromise();
	}
}
