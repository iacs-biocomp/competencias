import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IOrganigramaUsrDTO, IRelationsPostDTO } from 'sharedInterfaces/DTO';
import { ITrabajador } from 'sharedInterfaces/Entity';
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
		return firstValueFrom(this.httpClient.get<IOrganigramaUsrDTO[]>(url));
	}

	/**
	 *
	 * @param wrk The worker which relations as inferiores will be setted in database
	 * @param relations The relations to set
	 * @returns A {@link Promise} that resolves as `true` if it has been setted, rejected other
	 */
	setInferiores(wrk: Pick<ITrabajador, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/inferiores/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} una relaciones de inferiores:`,
			relations,
		);
		return firstValueFrom(this.httpClient.post<boolean>(url, relations));
	}

	/**
	 *
	 * @param wrk The worker which relations as superiores will be setted in database
	 * @param relations The relations to set
	 * @returns A {@link Promise} that resolves as `true` if it has been setted, rejected other
	 *
	 */
	setSuperiores(wrk: Pick<ITrabajador, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/superiores/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} unas relaciones de superiores:`,
			relations,
		);
		return firstValueFrom(this.httpClient.post<boolean>(url, relations));
	}

	/**
	 *
	 * @param wrk The worker which relations as pares will be setted in database
	 * @param relations The relations to set
	 * @returns A {@link Promise} that resolves as `true` if it has been setted, rejected other
	 *
	 */
	setPares(
		wrk: Pick<ITrabajador, 'dni'> | ITrabajador['dni'],
		relations: IRelationsPostDTO[],
	): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/pares/${dni}`;
		this.logger.debug(
			`POST req a: ${url}, añadiendo a trabajador con DNI: ${dni} unas relaciones de pares:`,
			relations,
		);

		return firstValueFrom(this.httpClient.post<boolean>(url, relations));
	}

	/**
	 *
	 * @param wrk The worker whose inferiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 *
	 */
	deleteInferiores(wrk: Pick<ITrabajador, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/inferiores/${dni}`;
		this.logger.debug(
			`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de inferiores`,
		);
		return firstValueFrom(this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)));
	}

	/**
	 *
	 * @param wrk The worker whose pares will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 *
	 */
	deletePares(wrk: Pick<ITrabajador, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/pares/${dni}`;
		this.logger.debug(`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de pares`);
		return firstValueFrom(this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)));
	}

	/**
	 *
	 * @param wrk The worker whose superiores will be delete
	 * @param relations The relations to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 */
	deleteSuperiores(wrk: Pick<ITrabajador, 'dni'> | string, relations: IRelationsPostDTO[]): Promise<boolean> {
		const dni = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/organigrama/superiores/${dni}`;
		this.logger.debug(
			`Req a: ${url}, eliminando a trabajador con DNI: ${dni} de las relaciones de superiores`,
		);
		return firstValueFrom(this.httpClient.delete<boolean>(url, this.getDeleteBody(relations)));
	}

	/**
	 *
	 * @param relations The object to set in the body
	 * @returns Wrap relations param adding `headers` key which is Content-Type application/json
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
