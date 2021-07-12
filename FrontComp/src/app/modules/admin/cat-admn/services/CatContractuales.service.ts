import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr } from 'sharedInterfaces/Entity';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	getAll(): Promise<ICContrAndCCompDTO[]> {
		//LOG: httpGet a ${apiUrlReq} obteniendo todas las catContractuales
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
		//LOG: httpDelete a ${apiUrlReq} borrando la catContractual con id ${id}
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${catContrId}`).toPromise();
	}

	/**
	 *
	 * @param catContract The catContract to add
	 * @returns A `Promise` that it's `true` if it has been add, exception if not
	 * @throws TODO: complete
	 */
	add(catContract: ICContrAddDTO): Promise<boolean> {
		//LOG: httpPost a ${apiUrlReq} añadiendo nueva catContractual ${catContract}
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}

	/**
	 *
	 * @param catContract the catContract to edit in the ddbb
	 * @returns A `Promise` that it's `true` if it has been edited, exception if not
	 * @throws TODO: complete
	 * TODO: DONE, testear
	 */
	update(catContract: ICContrAndCCompDTO): Promise<true> {
		//LOG: httpPut a ${apiUrlReq} actualizando la catContractual ${catContract}
		return this.httpClient.put<true>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
