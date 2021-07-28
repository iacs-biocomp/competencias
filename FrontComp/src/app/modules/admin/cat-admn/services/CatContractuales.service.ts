import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { CatContr } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 * TODO: DTO param type
	 *
	 */
	public getAll(): Promise<ICContrAndCCompDTO[]> {
		return this.httpClient.get<ICContrAndCCompDTO[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @throws Exception si no se ha podido borrar la CatContractual
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
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
	 *POST: add a new categoria competencial to the server
	 * @param catContract
	 * @returns
	 * TODO: DTO param type
	 */
	add(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}

	/**
	 *
	 * @param catContract
	 * @returns
	 * TODO: DTO param type
	 * TODO: Tsdoc
	 *
	 */
	update(catContract: ICContrAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
