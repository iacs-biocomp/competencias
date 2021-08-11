import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvAllRequiredDTO, IEvWithModelGetDTO } from 'sharedInterfaces/DTO';
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
	 * TODO: Probablemente así, completar en el backend ya que manda Ev[]
	 */
	public evaluacionesUsr(usr: IUser['username'] | Pick<IUser, 'username'>): Promise<IEvAllRequiredDTO[]> {
		const username = typeof usr === 'string' ? usr : usr.username;
		return this.httpClient
			.get<IEvAllRequiredDTO[]>(`${cnf.apiURL}/evaluaciones/user/${username}`)
			.toPromise();
	}

	/**
	 * @param evId El identificador de la evaluación
	 * @returns La evaluación con todos los datos del modelo
	 * TODO: DONE
	 *
	 */
	public getEvWithModel(evId: IEvaluacion['id']): Promise<IEvWithModelGetDTO> {
		return this.httpClient.get<IEvWithModelGetDTO>(cnf.apiURL + `/evaluaciones/${evId}`).toPromise();
	}
}
