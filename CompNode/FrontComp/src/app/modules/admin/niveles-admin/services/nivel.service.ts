import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { INivel } from '../../../../../../../interfaces/IEvaluaciones';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient) {}

	delete(nivel: INivel): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/niveles/${nivel.id}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas los niveles del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los niveles
	 */
	getAllNiveles(): Promise<INivel[]> {
		return this.httpClient.get<INivel[]>(`${cnf.apiURL}/niveles/all`).toPromise();
	}

	/**
	 * Metodo que borra un nivel del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarNivel(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/niveles/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			//TODO: Excepción si hay error lanzar a controlador (Componente)
			alert('No se ha podido borrar ese nivel, contacte con un administrador.');
		}
		return borrado;
	}

	//TODO: Tsdoc
	/** POST: add a new nivel to the server */
	addNivel(nivel: INivel): Promise<boolean> {
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
