import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { ICatComp } from '../../../../../../../interfaces/ICategorias';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient) {}

	async delete(catComp: ICatComp): Promise<boolean> {
		await this.httpClient.delete(`${cnf.apiURL}/catcomp/${catComp.id}`).toPromise();
		return true;
	}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	public getAllCatComp(): Promise<ICatComp[]> {
		return this.httpClient.get<ICatComp[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @returns Una promesa que es `true` si se ha borrado `false` en caso contrario
	 */
	async borrarCatComp(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/catcomp/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa categoría competencial, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new categoria competencial to the server */
	addCatComp(catComp: ICatComp): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}

	/**
	 *
	 * @param comport La categoria competencial a editar en la base de datos
	 * @returns Una promesa que es `true` si se ha editado `false` en caso contrario
	 */
	 editCompt(catComp: ICatComp): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}

}
