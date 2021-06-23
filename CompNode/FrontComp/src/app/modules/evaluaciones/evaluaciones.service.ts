import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvAllRequired } from 'sharedInterfaces/DTO';
import { IEvaluacion, IUserJson } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/**
 * Destinado a la obtención de datos relacionados con las evaluaciones de los usuarios, para la administración de las evs usar
 * el servicio {@link EvaluacionesAdmService}
 */
@Injectable({
	providedIn: 'root',
})
export class EvaluacionesService {
	constructor(private httpClient: HttpClient) {}

	/**
	 *
	 * @param usr El nombre de usuario como string o objeto que tenga la propiedad usuario
	 * @returns Todas las evaluaciones de un usuario
	 */
	public evaluacionesUsr(usr: string | Pick<IUserJson, 'username'>): Promise<IEvAllRequired[]> {
		const username = typeof usr === 'string' ? usr : usr.username;
		return this.httpClient.get<IEvAllRequired[]>(cnf.apiURL + `/evaluaciones/user/${username}`).toPromise();
	}

	/**
	 * Obtiene una evaluación con todos los datos del modelo
	 * @param evId El identificador de la evaluación
	 * @returns La evaluación con todos los datos del modelo
	 */
	public getEvWithModel(evId: IEvaluacion['id']): Promise<IEvAllRequired> {
		return this.httpClient.get<IEvAllRequired>(cnf.apiURL + `/evaluaciones/${evId}`).toPromise();
	}
}
