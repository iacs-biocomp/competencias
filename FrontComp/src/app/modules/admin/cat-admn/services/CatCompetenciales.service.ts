import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICCompAddDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { CatComp } from '../../../../../../../back-comp/src/entity/CatComp.entity';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * GET: get all the categorias competenciales to the server, used only for the ADMIN
	 *
	 * @returns `Array` with all the CatComps
	 *
	 */
	public async getAll(): Promise<ICCompDTO[]> {
		return this.httpClient.get<ICCompDTO[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	/**
	 * DELETE: delete a categoria competencial to the server
	 *
	 * @param cComp The id from the cComp that we want to delete
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 *
	 */
	async delete(cComp: CatComp['id'] | Pick<CatComp, 'id'>): Promise<boolean> {
		const catCompId = typeof cComp === 'string' ? cComp : cComp.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcomp/${catCompId}`).toPromise();
	}

	/**
	 * POST: add a new categoria competencial to the server
	 *
	 * @param catComp The catComp we want to add
	 * @returns A `Promise` that it's `True` if it has been add, `False` if it hasn't
	 *
	 */
	add(catComp: ICCompAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}

	/**
	 *
	 * @param catComp the catComp to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 *
	 */
	edit(catComp: ICCompDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}
}
