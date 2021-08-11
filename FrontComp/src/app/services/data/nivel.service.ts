import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { INivel } from 'sharedInterfaces/Entity';
import { INivelAddDTO, INivelGetDTO, INivelPutDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient) {}

	getAll(): Promise<INivelGetDTO[]> {
		return this.httpClient.get<INivelGetDTO[]>(`${cnf.apiURL}/niveles/all`).toPromise();
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
		return this.httpClient.get<INivel>(`${cnf.apiURL}/niveles/${idNivel}`).toPromise();
	}

	/**
	 * GET: get all the niveles for reference to the server
	 *
	 * @returns `Promise` with all the reference niveles
	 * TODO: DONE, testear
	 *
	 */
	getAllRefNivs(): Promise<INivelGetDTO[]> {
		return this.httpClient.get<INivelGetDTO[]>(`${cnf.apiURL}/niveles/reference`).toPromise();
	}

	/**
	 * @param nivel level's id which will be deleted
	 * @returns A `Promise` that it's `true` if it has been deleted, `false` if it hasn't
	 */
	delete(nivel: INivel['id'] | Pick<INivel, 'id'>): Promise<boolean> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/niveles/${idNivel}`).toPromise();
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
		return this.httpClient.post<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
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
		return this.httpClient.put<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
	}
}
