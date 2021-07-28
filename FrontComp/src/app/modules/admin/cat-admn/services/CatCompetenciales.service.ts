import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICCompAddDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { CatComp } from '../../../../../../../back-comp/src/entity/CatComp.entity';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient) {}

	public async getAll(): Promise<ICCompDTO[]> {
		return this.httpClient.get<ICCompDTO[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	/**
	 *
	 * @param cComp The id from the cComp to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * @throws TODO: complete
	 */
	async delete(cComp: CatComp['id'] | Pick<CatComp, 'id'>): Promise<boolean> {
		const catCompId = typeof cComp === 'string' ? cComp : cComp.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcomp/${catCompId}`).toPromise();
	}

	/**
	 *
	 * @param catComp The catComp to add
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws TODO: complete ()
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
