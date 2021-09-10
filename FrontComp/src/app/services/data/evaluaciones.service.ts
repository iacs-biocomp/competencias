import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvAllRequiredDTO, IEvWithModelGetDTO, ITrabajadorDTO } from 'sharedInterfaces/DTO';
import { IEvaluacion, IUser } from 'sharedInterfaces/Entity';
import { WORKERS_EVALUATED } from 'src/app/modules/evaluaciones/components/list-people-to-eval/data';
import { environment as cnf } from 'src/environments/environment';
import { LogService } from 'src/app/shared/log/log.service';

/**
 * Destinado a la obtención de datos relacionados con las evaluaciones de los usuarios, para la administración de las evs usar
 * el servicio {@link EvaluacionesAdmService}
 */
@Injectable({
	providedIn: 'root',
})
export class EvaluacionesService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	/**
	 * TODO: Probablemente así, completar en el backend ya que manda Ev[]
	 */
	public evaluacionesUsr(usr: IUser['username'] | Pick<IUser, 'username'>): Promise<IEvAllRequiredDTO[]> {
		const username = typeof usr === 'string' ? usr : usr.username;
		const url = `${cnf.API_URL}/evaluaciones/user/${username}`;
		this.logger.debug(`Obteniendo evaluaciones del usuario con username: ${username}, mandando req a ${url}`);
		return this.httpClient.get<IEvAllRequiredDTO[]>(url).toPromise();
	}

	/**
	 * @param evId El identificador de la evaluación
	 * @returns La evaluación con todos los datos del modelo
	 *
	 */
	public getEvWithModel(evId: IEvaluacion['id']): Promise<IEvWithModelGetDTO> {
		const url = `${cnf.API_URL}/evaluaciones/${evId}`;
		this.logger.debug(
			`Obteniendo la evaluacion con ID: ${evId} con todos los datos del modelo, mandando req a: ${url}`,
		);
		return this.httpClient.get<IEvWithModelGetDTO>(url).toPromise();
	}

	// TODO: TSdoc
	getEvaluatedOfUser(usernameOrObj: IUser['username'], evId: IEvaluacion['id']): Promise<ITrabajadorDTO[]> {
		// return new Promise(res =>
		// 	setTimeout(() => {
		// 		res(WORKERS_EVALUATED);
		// 	}, 350),
		// );
		return this.httpClient
			.get<ITrabajadorDTO[]>(`${cnf.API_URL}/evaluaciones/organi/${usernameOrObj}/${evId}`)
			.toPromise();
	}
}
