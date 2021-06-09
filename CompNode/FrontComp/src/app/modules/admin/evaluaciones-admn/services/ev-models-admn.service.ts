import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, IEvModel } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/** Servicio crud para el manejo de los modelos de las evaluaciones */
@Injectable({ providedIn: 'root' })
export class EvModelsAdmnService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * Envia un modelo al backend intentando guardarlo.
	 *
	 * @param evModel El modelo a guardar
	 * @returns //TODO
	 */
	save(evModel: IModelDTO, reference: boolean): Promise<IEvModel> {
		console.log(String(reference));
		return this.httpClient
			.post<IEvModel>(`${cnf.apiURL}/modelos`, evModel, { params: { reference: String(reference) } })
			.toPromise();
	}
	/**
	 * @returns Un array de todos los modelos de evaluaciones disponibles, independientemente de para que catComp sean
	 */
	getAll(): Promise<IEvModel[]> {
		return this.httpClient.get<IEvModel[]>(`${cnf.apiURL}/modelos`).toPromise();
	}
	/**
	 * @returns Un array de todos los modelos de evaluaciones disponibles, independientemente de para que catComp sean
	 */
	getAllReference(): Promise<IRefModel[]> {
		return this.httpClient.get<IRefModel[]>(`${cnf.apiURL}/modelos/references`).toPromise();
	}
	//TODO: Tsdoc
	getOneReference(catComp: ICatComp | string): Promise<IRefModel> {
		const id = typeof catComp === 'string' ? catComp : catComp.id;
		return this.httpClient.get<IRefModel>(`${cnf.apiURL}/modelos/reference/${id}`).toPromise();
	}
	//TODO: Tsdoc
	updateRefModel(refModel: IRefModel): Promise<boolean> {
		return this.httpClient
			.put<boolean>(`${cnf.apiURL}/modelos/reference`, refModel, { params: { reference: 'true' } })
			.toPromise();
	}
}
