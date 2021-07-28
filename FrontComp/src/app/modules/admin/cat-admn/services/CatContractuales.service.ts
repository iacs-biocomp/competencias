import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { CatContr } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * GET: get all the categorias contractuales to the server, used only for the ADMIN
	 *
	 * @returns `Array` with all the CatContact and his cComp
	 */
	public getAll(): Promise<ICContrAndCCompDTO[]> {
		return this.httpClient.get<ICContrAndCCompDTO[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}

	/**
	 * DELETE: delete a categoria contractual to the server
	 *
	 * @param cContr The id from the cContr that we want to delete
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 */
	async delete(cContr: CatContr['id'] | Pick<CatContr, 'id'>): Promise<boolean> {
		const catContrId = typeof cContr === 'string' ? cContr : cContr.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${catContrId}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa categoría contractual, contacte con un administrador.');
		}
		return borrado;
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
	 * PUT: edit a catContr to the server
	 *
	 * @param catContract the catContract to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 * TODO: DONE, testear
	 */
	update(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
