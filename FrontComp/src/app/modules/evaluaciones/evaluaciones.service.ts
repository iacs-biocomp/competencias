import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvaluacion, IUser } from 'sharedInterfaces/Entity';
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
	 * TODO: Return parameter correcto??
	 */
	public evaluacionesUsr(usr: IUser['username'] | Pick<IUser, 'username'>): Promise<IEvaluacion[]> {
		const username = typeof usr === 'string' ? usr : usr.username;
		return this.httpClient.get<IEvaluacion[]>(cnf.apiURL + `/evaluaciones/user/${username}`).toPromise();
	}

	/**
	 * @param evId El identificador de la evaluación
	 * @returns La evaluación con todos los datos del modelo
	 * TODO: DTO return type (cambiar sharedInterfaces)
	 *
	 */
	public getEvWithModel(evId: IEvaluacion['id']): Promise<IEvaluacion> {
		return this.httpClient.get<IEvaluacion>(cnf.apiURL + `/evaluaciones/${evId}`).toPromise();
	}
}
