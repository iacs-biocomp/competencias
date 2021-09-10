import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO, ITrabOrgani, IRelationsPostDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OrganiService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	/**
	 * @returns The full organization chart of all saved users in db
	 * TODO: test if correct
	 */
	getFullOrgani(): Promise<IOrganigramaUsrDTO[]> {
		const url = `${cnf.API_URL}/organigrama/all`;
		this.logger.debug(`Obteniendo el organigrama completo de: ${url}`);
		return this.httpClient.get<IOrganigramaUsrDTO[]>(url).toPromise();
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
		const url = `${cnf.API_URL}/organigrama/inferiores/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} una relaciones de inferiores:`,
			relations,
		);
		return this.httpClient.post<boolean>(url, relations).toPromise();
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
		const url = `${cnf.API_URL}/organigrama/superiores/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} unas relaciones de superiores:`,
			relations,
		);
		return this.httpClient.post<boolean>(url, relations).toPromise();
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
		const url = `${cnf.API_URL}/organigrama/pares/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} unas relaciones de pares:`,
			relations,
		);

		return this.httpClient.post<boolean>(url, relations).toPromise();
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
		const url = `${cnf.API_URL}/organigrama/inferiores/${dni}`;
		this.logger.debug(
			`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de inferiores`,
		);
		return this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)).toPromise();
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
		const url = `${cnf.API_URL}/organigrama/pares/${dni}`;
		this.logger.debug(`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de pares`);
		return this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)).toPromise();
	}

	/**
	 *
	 * @param wrk The worker whose superiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 */
	deleteSuperiores(wrk: Pick<ITrabOrgani, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/superiores/${dni}`;
		this.logger.debug(
			`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de superiores`,
		);
		return this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)).toPromise();
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
