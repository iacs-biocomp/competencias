import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { ICatContr } from '../../../../../../../interfaces/ICategorias';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	async delete(catContract: ICatContr): Promise<boolean> {
		//TODO: Cambiar url a la correcta
		await this.httpClient.delete(`${cnf.apiURL}/changeme/${catContract.id}`).toPromise();
		return true;
	}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	public getAllCatContract(): Promise<ICatContr[]> {
		//TODO: Cambiar url a la correcta
		return this.httpClient.get<ICatContr[]>(`${cnf.apiURL}/changeme/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async delCatContract(id: string): Promise<boolean> {
		//TODO: Cambiar url a la correcta
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/changeme/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa categoría competencial, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new categoria competencial to the server */
	addCatContract(catContract: ICatContr): Promise<boolean> {
		//TODO: Cambiar url a la correcta
		return this.httpClient.post<boolean>(`${cnf.apiURL}/changeme`, catContract).toPromise();
	}
}
