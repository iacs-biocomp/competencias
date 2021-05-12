import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICatContr } from 'sharedInterfaces/Entity/ICategorias';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	public getAll(): Promise<ICatContr[]> {
		return this.httpClient.get<ICatContr[]>(`${cnf.apiURL}/catcontr/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @throws Exception si no se ha podido borrar la CatContractual
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async delete(id: string): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcontr/${id}`).toPromise();
	}

	/** POST: add a new categoria competencial to the server */
	add(catContract: ICatContr): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
	update(catContract: ICatContr): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcontr`, catContract).toPromise();
	}
}
