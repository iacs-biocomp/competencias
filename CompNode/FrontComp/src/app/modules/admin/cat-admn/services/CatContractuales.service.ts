import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { ICatContr } from '../../../../../../../interfaces/ICategorias';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	public delete(catContract: ICatContr): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${catContract.id}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	public getAllCatContract(): Promise<ICatContr[]> {
		return this.httpClient.get<ICatContr[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async delCatContract(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa categoría contractual, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new categoria competencial to the server */
	addCatContract(catContract: ICatContr): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
