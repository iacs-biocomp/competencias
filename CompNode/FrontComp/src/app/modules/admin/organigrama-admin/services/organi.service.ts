import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO, ITrabOrgani } from 'sharedInterfaces/DTO';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OrganiService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * @returns {IOrganigramaUsrDTO} El organigrama completo de la bbdd
	 */
	getFullOrgani(): Promise<IOrganigramaUsrDTO[]> {
		return this.httpClient.get<IOrganigramaUsrDTO[]>(`${cnf.apiURL}/organigrama/all`).toPromise();
	}

	/**
	 *
	 * @param wrk
	 * @param relations Las relaciones que se quieren settear
	 * @returns `true` si se ha guardado correctamente `false` en caso contrario
	 */
	setInferiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/inferiores/${dni}`, relations)
			.toPromise();
	}

	/**
	 *
	 * @param wrk El trabajador del que se quiere eliminar superiores o su dni como string
	 * @param relations Las relaciones que se quieren settear
	 * @returns `true` si se ha guardado correctamente `false` en caso contrario
	 */
	setSuperiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/superiores/${dni}`, relations)
			.toPromise();
	}

	/**
	 *
	 * @param wrk El trabajador del que se quiere eliminar superiores o su dni como string
	 * @param relations Las relaciones que se quieren settear
	 * @returns `true` si se ha guardado correctamente `false` en caso contrario
	 */
	setPares(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient.post<boolean>(`${cnf.apiURL}/organigrama/pares/${dni}`, relations).toPromise();
	}

	/**
	 *
	 * @param wrk El trabajador del que se quiere eliminar superiores o su dni como string
	 * @param relations Las relaciones que se quieren eliminar
	 * @returns `true` si se ha borrado correctamente `false` en caso contrario
	 */
	deleteInferiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/inferiores/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param wrk El trabajador del que se quiere eliminar superiores o su dni como string
	 * @param relations Las relaciones que se quieren eliminar
	 * @returns `true` si se ha borrado correctamente `false` en caso contrario
	 */
	deletePares(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/pares/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param wrk El trabajador del que se quiere eliminar superiores o su dni como string
	 * @param relations Las relaciones que se quieren eliminar
	 * @returns `true` si se ha borrado correctamente `false` en caso contrario
	 */
	deleteSuperiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/superiores/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param relations El objeto a poner en el body
	 * @returns El objeto options  que se le puede pasar al httpClient.delete()
	 */
	private getDeleteBody(relations: ITrabOrgani[]) {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: relations,
		};
	}
}
