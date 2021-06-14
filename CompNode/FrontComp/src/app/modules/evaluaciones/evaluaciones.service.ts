import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvAllRequired } from 'sharedInterfaces/DTO';
import { environment as cnf } from 'src/environments/environment';
import { EvaluacionesAdmService } from '../admin/evaluaciones-admn/services/evaluaciones-adm.service';

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
	public evaluacionesUsr(usr: string | { usuario: string }): Promise<IEvAllRequired[]> {
		const username = typeof usr === 'string' ? usr : usr.usuario;
		return this.httpClient.get<IEvAllRequired[]>(cnf.apiURL + `/evaluaciones/${username}`).toPromise();
	}
}
