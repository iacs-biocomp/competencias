import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr } from 'sharedInterfaces/Entity';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	getAll(): Promise<ICContrAndCCompDTO[]> {
		return this.httpClient.get<ICContrAndCCompDTO[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}

	/**
	 *
	 * @param cContr The id of cContr or cContr that will be deleted
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * @throws TODO: complete
	 */
	delete(cContr: ICatContr['id'] | Pick<ICatContr, 'id'>): Promise<boolean> {
		const catContrId = typeof cContr === 'string' ? cContr : cContr.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${catContrId}`).toPromise();
	}

	/**
	 *
	 * @param catContract The catContract to add
	 * @returns A `Promise` that it's `true` if it has been add, exception if not
	 * @throws TODO: complete
	 */
	add(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}

	/**
	 *
	 * @param catContract the catContract to edit in the ddbb
	 * @returns A `Promise` that it's `true` if it has been edited, exception if not
	 * TODO: DONE, testear
	 */
	update(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
