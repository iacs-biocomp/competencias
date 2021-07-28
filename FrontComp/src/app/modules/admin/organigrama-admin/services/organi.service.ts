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
	 * @returns {IOrganigramaUsrDTO} The organigrama of the user
	 */
	getFullOrgani(): Promise<IOrganigramaUsrDTO[]> {
		return this.httpClient.get<IOrganigramaUsrDTO[]>(`${cnf.apiURL}/organigrama/all`).toPromise();
	}

	/**
	 *
	 * @param wrk the worker whose inferiors to search
	 * @param relations The relations to set
	 * @returns A `Promise` that it's `true` if it has been setted, exception if not
	 * @throws TODO: complete
	 */
	setInferiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/inferiores/${dni}`, relations)
			.toPromise();
	}

	/**
	 *
	 * @param wrk the worker whose superiores to search
	 * @param relations The relations to set
	 * @returns A `Promise` that it's `true` if it has been setted, exception if not
	 * @throws TODO: complete
	 *
	 */
	setSuperiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/superiores/${dni}`, relations)
			.toPromise();
	}

	/**
	 *
	 * @param wrk the worker whose pares to search
	 * @param relations The relations to set
	 * @returns A `Promise` that it's `true` if it has been setted, exception if not
	 * @throws TODO: complete
	 * TODO: DTO param
	 *
	 */
	setPares(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient.post<boolean>(`${cnf.apiURL}/organigrama/pares/${dni}`, relations).toPromise();
	}

	/**
	 *
	 * @param wrk The worker whose inferiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * TODO: DTO param
	 *
	 */
	deleteInferiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/inferiores/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param wrk The worker whose pares will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * TODO: DTO param
	 *
	 */
	deletePares(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/pares/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param wrk The worker whose superiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * TODO: DTO param
	 */
	deleteSuperiores(wrk: ITrabOrgani | string, relations: ITrabOrgani[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/superiores/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param relations The object to put in the body
	 * @returns The object options that can be stay in httpClient.delete()
	 * TODO: DTO param
	 *
	 */
	private getDeleteBody<T>(relations: T) {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: relations,
		};
	}
}
