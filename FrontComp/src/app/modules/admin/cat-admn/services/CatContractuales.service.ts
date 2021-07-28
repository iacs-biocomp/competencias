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
	 * DELETE: delete a categoria contractual to the server
	 *
	 * @param cContr The id from the cContr that we want to delete
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 */
	delete(cContr: ICatContr['id'] | Pick<ICatContr, 'id'>): Promise<boolean> {
		const catContrId = typeof cContr === 'string' ? cContr : cContr.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${catContrId}`).toPromise();
	}

	/**
	 * POST: add a new categoria contractual to the server
	 *
	 * @param catContract The catContract we want to add
	 * @returns A `Promise` that it's `True` if it has been add, `False` if it hasn't
	 */
	add(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}

	/**
	 *
	 * @param catContract the catContract to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 * TODO: DONE, testear
	 */
	update(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
