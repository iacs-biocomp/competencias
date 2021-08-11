import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvSendDTO, IUpdateEvShowingResultsDTO } from 'sharedInterfaces/DTO';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/** Tiene todos los metodos necesarios para la administración de las Evaluaciones y Modelos */
@Injectable({ providedIn: 'root' })
export class EvaluacionesAdmService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * @returns Una promsesa que se resuelve como un array de todas las evaluaciones que tiene el backend
	 * TODO: DTO return type
	 */
	public async getAll(): Promise<IEvaluacion[]> {
		return this.httpClient.get<IEvaluacion[]>(`${cnf.apiURL}/evaluaciones`).toPromise();
	}

	/**
	 * @param id id de la evaluacion a borrar
	 * @returns una promesa que se resulelve como boolean `true` si se puede borar, `false` si no
	 * @throws completar
	 */
	delete(idOrObj: IEvaluacion['id'] | Pick<IEvaluacion, 'id'>): Promise<true> {
		const id = typeof idOrObj === 'number' ? idOrObj : idOrObj.id;
		return this.httpClient.delete<true>(`${cnf.apiURL}/evaluaciones/${id}`).toPromise();
	}

	/**
	 *
	 * @param evalu la evaluacion a guardar
	 * @returns una promesa que se resuelve como boolean `true` si se puede guardar, `false` si no
	 * @throws completar a futuro
	 */
	add(evalu: IEvSendDTO): Promise<true> {
		return this.httpClient.post<true>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	}

	// /**
	//  *
	//  * @param evalu la evaluacion que se quiere editar
	//  * @returns una promesa que se resuelve como boolean `true` si se puede editar, `false` si no
	//  * TODO: DONE, testear
	//  *
	//  */
	// edit(evalu: IEvSendDTO): Promise<boolean> {
	// 	return this.httpClient.put<boolean>(`${cnf.apiURL}/evaluaciones`, evalu).toPromise();
	// }

	updateShowingResults(payload: IUpdateEvShowingResultsDTO) {
		return this.httpClient.post<true>(`${cnf.apiURL}/evaluaciones/showing-results`, payload).toPromise();
	}
}
