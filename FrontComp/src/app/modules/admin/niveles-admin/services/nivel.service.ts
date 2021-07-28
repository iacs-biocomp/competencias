import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { INivel } from 'sharedInterfaces/Entity';
import { INivelAddDTO, INivelGetDTO } from 'sharedInterfaces/DTO';
import { Nivel } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * GET: get all the niveles to the server, used only for the ADMIN
	 *
	 * @returns `Array` with all the CatComps
	 * TODO: DTO return type, no esta hecho?
	 */
	getAll(): Promise<INivel[]> {
		return this.httpClient.get<INivel[]>(`${cnf.apiURL}/niveles/all`).toPromise();
	}

	/**
	 * GET: get one nivel by ID to the server
	 *
	 * @returns Un `Array` de todos los niveles, sean o no de referencia
	 * @returns `Promise` with all the niveles, whether or not they are for reference
	 * TODO: DONE, testear
	 *
	 */
	getOne(nivel: Nivel['id'] | Pick<Nivel, 'id'>): Promise<INivel> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		return this.httpClient.get<INivel>(`${cnf.apiURL}/niveles/${idNivel}`).toPromise();
	}

	/**
	 * GET: get all the niveles for reference to the server
	 *
	 * @returns `Promise` with all the reference niveles
	 * TODO: DTO return type, no esta hecho?
	 *
	 */
	getAllRefNivs(): Promise<INivel[]> {
		return this.httpClient.get<INivel[]>(`${cnf.apiURL}/niveles/reference`).toPromise();
	}

	/**
	 * DELETE: delete a nivel to the server
	 *
	 * @param nivel The id from the nivel that we want to delete
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 *
	 */
	async delete(nivel: Nivel['id'] | Pick<Nivel, 'id'>): Promise<boolean> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/niveles/${idNivel}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar ese nivel, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * POST: add a new nivel to the server
	 *
	 * @param nivel The nivel we want to add
	 * @returns A `Promise` that it's `True` if it has been add, `False` if it hasn't
	 * TODO: DONE, testear
	 */
	add(nivel: INivelAddDTO): Promise<boolean> {
		//*QUAL: Crear INivelPostDto o similar
		return this.httpClient.post<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
	}

	/**
	 * PUT: edit a catComp to the server
	 *
	 * @param nivel the nivel to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 *
	 * TODO: DTO param type
	 *
	 */
	edit(nivel: INivelAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
	}
}
