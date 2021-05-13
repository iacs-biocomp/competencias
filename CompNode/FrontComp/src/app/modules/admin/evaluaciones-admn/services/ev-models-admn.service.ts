import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { IEvModel } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/** Servicio crud para el manejo de los modelos de las evaluaciones */
@Injectable({ providedIn: 'root' })
export class EvModelsAdmnService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * Envia un modelo al backend intentando guardarlo.
	 * @param evModel El modelo a guardar
	 * @returns Una promesa que se resuelve como `true` si se ha guardado y `false` en caso contrario
	 */
	save(evModel: IModelDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/modelos`, evModel).toPromise();
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
}
