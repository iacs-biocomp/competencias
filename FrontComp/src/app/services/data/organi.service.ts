import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO, ITrabOrgani, IRelationsPostDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OrganiService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * @returns The full organization chart of all saved users in db
	 * TODO: test if correct
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
	setInferiores(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
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
	setSuperiores(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
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
	 *
	 */
	setPares(
		wrk: Pick<ITrabOrgani, 'dni'> | ITrabOrgani['dni'],
		relations: IRelationsPostDTO[],
	): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient.post<boolean>(`${cnf.apiURL}/organigrama/pares/${dni}`, relations).toPromise();
	}

	/**
	 *
	 * @param wrk The worker whose inferiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 *
	 */
	deleteInferiores(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
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
	 *
	 */
	deletePares(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
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
	 */
	deleteSuperiores(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/superiores/${dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param relations The object to set in the body
	 * @returns Wrap relations param adding `headers` key which is Content-Type application/json
	 * TODO: return type, extract type from method body
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
type ChangeName = {};
