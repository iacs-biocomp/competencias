import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { INivel } from 'sharedInterfaces/Entity';
import { INivelToAdd } from '../niv-table/niv-table.component';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene todas los niveles del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los niveles
	 */
	getAll(): Promise<INivel[]> {
		return this.httpClient.get<INivel[]>(`${cnf.apiURL}/niveles/all`).toPromise();
	}

	/**
	 * Obtiene todos los niveles de referencia
	 *
	 */
	getAllRefNivs(): Promise<INivel[]> {
		return this.httpClient.get<INivel[]>(`${cnf.apiURL}/niveles/reference`).toPromise();
	}


	/**
	 * Metodo que borra un nivel del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	delete(nivel: INivel): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/niveles/${nivel.id}`).toPromise();
	}

	/**
	 * Petición de tipo POST, añade a la base de datos un nuevo nivel
	 *
	 * @throws Exception, de tipo http con su codigo de error si ya existe ese nivel
	 * @returns `true` si se ha añadido correctamente el nivel a la bbdd o `false`/`exception` en otros casos
	 */
	add(nivel: INivelToAdd): Promise<boolean> {
		// TODO: Crear INivelPostDto o similar
		return this.httpClient.post<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
	}
	/**
	 *
	 * @param comp El nivel a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	editNivel(nivel: INivel): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/niveles`, nivel).toPromise();
	}
}
