import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp, IEvModel } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/** Servicio crud para el manejo de los modelos de las evaluaciones */
@Injectable({ providedIn: 'root' })
export class EvModelsAdmnService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * POST: save a model to the server
	 *
	 * @param evModel The model to save
	 * @param reference
	 * TODO: complete
	 * @returns The dto with the evModel info to save
	 * TODO: DONE, testear
	 *
	 */
	save(evModel: IModelDTO, reference: boolean): Promise<IEvModel> {
		// console.log(String(reference));
		// TODO: Cambiado a boolean, al serializar se queda true en vez de "true", comprobar en backend que es boolean con pipe
		return this.httpClient
			.post<IEvModel>(`${cnf.apiURL}/modelos`, evModel, { params: { reference: reference } })
			.toPromise();
	}

	/**
	 * GET: get all the categorias competenciales to the server
	 *
	 * @returns `Array` with all the EvModel availables, regardless of for catComp to be
	 * TODO: Falta DTO?
	 */
	getAll(): Promise<IEvModel[]> {
		return this.httpClient.get<IEvModel[]>(`${cnf.apiURL}/modelos`).toPromise();
	}

	/**
	 * @returns `Array` with all the EvModel availables, regardless of for catComp to be
	 */
	getAllReference(): Promise<IRefModel[]> {
		return this.httpClient.get<IRefModel[]>(`${cnf.apiURL}/modelos/references`).toPromise();
	}

	/**
	 * @param catComp La catComp o su id con la que se busca su modelo de referencia
	 * @returns El modelo de referencia que tiene esa catComp asociada
	 */
	getOneReference(catComp: ICatComp | ICatComp['id']): Promise<IRefModel> {
		const id = typeof catComp === 'string' ? catComp : catComp.id;
		return this.httpClient.get<IRefModel>(`${cnf.apiURL}/modelos/reference/${id}`).toPromise();
	}

	/**
	 *
	 * @param refModel El modelo de referencia con toda la información actualizada
	 * @returns `true` si se ha guardado correctamente `false` en caso contrario
	 * TODO: DTO param type
	 *
	 */
	updateRefModel(refModel: IRefModel): Promise<boolean> {
		return this.httpClient
			.put<boolean>(`${cnf.apiURL}/modelos/reference`, refModel, { params: { reference: 'true' } })
			.toPromise();
	}
}
