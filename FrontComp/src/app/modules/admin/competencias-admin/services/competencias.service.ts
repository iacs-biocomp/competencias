import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { Competencia } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class CompetenciasService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * GET: get all the competencias to the server, used only for the ADMIN
	 *
	 * @returns `Array` with all the competencias
	 *
	 */
	public getAll(): Promise<ICompGetDTO[]> {
		return this.httpClient.get<ICompGetDTO[]>(`${cnf.apiURL}/competencias/all`).toPromise();
	}

	/**
	 * DELETE: delete a competencia to the server
	 *
	 * @param cComp The id from the competencia that we want to delete
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 *	 */
	async delete(comp: Competencia['id'] | Pick<Competencia, 'id'>): Promise<boolean> {
		const compId = typeof comp === 'string' ? comp : comp.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${compId}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa competencia, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * POST: add a new competencia to the server
	 *
	 * @param comp The competencia we want to add
	 * @returns A `Promise` that it's `True` if it has been add, `False` if it hasn't
	 *
	 */
	add(comp: ICompAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}

	/**
	 * PUT: edit a catComp to the server
	 *
	 * @param comp the competencia to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 *
	 */
	edit(comp: ICompAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}
}
