import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICatComp } from 'sharedInterfaces/Entity';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient) {}

	public delete(cComp: ICatComp['id'] | Pick<ICatComp, 'id'>): Promise<boolean> {
		const catCompId = typeof cComp === 'string' ? cComp : cComp.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/catcomp/${catCompId}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas las categorias competenciales del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todas las categorias competenciales
	 */
	public async getAll(): Promise<ICatComp[]> {
		return this.httpClient.get<ICatComp[]>(`${cnf.apiURL}/catcomp/all`).toPromise();
	}

	/**
	 * Metodo que borra una categoria competencial del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarCatComp(idOrObj: ICatComp['id'] | Pick<ICatComp, 'id'>): Promise<boolean> {
		const cCompId = typeof idOrObj === 'string' ? idOrObj : idOrObj.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/catcomp/${cCompId}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar esa categoría competencial, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * Añade una nueva categoría competencial a la base de datos
	 *
	 * @param catComp La categoría competencial a añadir
	 */
	add(catComp: ICatComp): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}

	/**
	 *
	 * @param catComp La competencia a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	edit(catComp: ICatComp): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/catcomp`, catComp).toPromise();
	}
}