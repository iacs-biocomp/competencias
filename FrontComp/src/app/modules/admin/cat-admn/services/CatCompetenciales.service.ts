import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICCompAddDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient) {}

	public async getAll(): Promise<ICCompDTO[]> {
		return this.httpClient.get<ICCompDTO[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	/**
	 *
	 * @param cComp The id of the cComp to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * @throws TODO: complete
	 */
	async delete(cComp: ICatComp['id'] | Pick<ICatComp, 'id'>): Promise<true> {
		const catCompId = typeof cComp === 'string' ? cComp : cComp.id;
		return this.httpClient.delete<true>(`${cnf.apiURL}/catcomp/${catCompId}`).toPromise();
	}

	/**
	 *
	 * @param catComp The catComp to add
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws TODO: complete ()
	 *
	 */
	add(catComp: ICCompAddDTO): Promise<true> {
		return this.httpClient.post<true>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}

	/**
	 *
	 * @param catComp the catComp to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 * @throws TODO: complete ()
	 *
	 */
	edit(catComp: ICCompDTO): Promise<true> {
		return this.httpClient.put<true>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}
}
