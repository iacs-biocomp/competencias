import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { INivel } from 'sharedInterfaces/Entity';
import { INivelAddDTO, INivelGetDTO, INivelPutDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<INivelGetDTO[]> {
		const url = `${cnf.API_URL}/niveles/all`;
		this.logger.debug(`Obteniendo todos los niveles de ${url}`);
		return this.httpClient.get<INivelGetDTO[]>(url).toPromise();
	}

	/**
	 *
	 * @returns Un `Array` de todos los niveles, sean o no de referencia
	 * @returns `Promise` with all the niveles, whether or not they are for reference
	 * TODO: DONE, testear
	 *
	 */
	getOne(nivel: INivel['id'] | Pick<INivel, 'id'>): Promise<INivelGetDTO> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		const url = `${cnf.API_URL}/niveles/${idNivel}`;
		this.logger.debug(`Obteniendo el nivel con ID: ${idNivel}, mandado req a: ${url}`);
		return this.httpClient.get<INivel>(url).toPromise();
	}

	/**
	 * GET: get all the niveles for reference to the server
	 *
	 * @returns `Promise` with all the reference niveles
	 * TODO: DONE, testear
	 *
	 */
	getAllRefNivs(): Promise<INivelGetDTO[]> {
		const url = `${cnf.API_URL}/niveles/reference`;
		this.logger.debug(`Obteniendo todos los niveles de referencia de: ${url}`);
		return this.httpClient.get<INivelGetDTO[]>(url).toPromise();
	}

	/**
	 * @param nivel level's id which will be deleted
	 * @returns A `Promise` that it's `true` if it has been deleted, `false` if it hasn't
	 */
	delete(nivel: INivel['id'] | Pick<INivel, 'id'>): Promise<boolean> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		const url = `${cnf.API_URL}/niveles/${idNivel}`;
		this.logger.debug(`Eliminando el nivel con ID: ${idNivel}, mandando req a: ${url}`);
		return this.httpClient.delete<boolean>(url).toPromise();
	}

	/**
	 * POST: add a new nivel to the server
	 *
	 * @param nivel The nivel we want to add
	 * @returns A `Promise` that it's `true` if it has been add, `false` if it hasn't
	 * TODO: DONE, reference falta, bien?
	 */
	add(nivel: INivelAddDTO): Promise<boolean> {
		//*QUAL: Crear INivelPostDto o similar
		const url = `${cnf.API_URL}/niveles`;
		this.logger.debug(`Añadiendo nivel con CÓDIGO: ${nivel.code}, POST req a: ${url}`, nivel);
		return this.httpClient.post<boolean>(url, nivel).toPromise();
	}

	/**
	 *
	 * @param nivel the nivel to edit in the ddbb
	 * @returns A `Promise` that it's `true` if it has been edited, `false` if it hasn't
	 *
	 * TODO: DONE, reference falta, bien?
	 *
	 */
	edit(nivel: INivelPutDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/niveles`;
		this.logger.debug(`Editando nivel con CÓDIGO: ${nivel.code}, PUT req a ${url}`, nivel);
		return this.httpClient.put<boolean>(url, nivel).toPromise();
	}
}
