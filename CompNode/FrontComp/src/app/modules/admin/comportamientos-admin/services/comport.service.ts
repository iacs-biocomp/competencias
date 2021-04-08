import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from '../../../../../environments/environment';
import { IComportamiento } from '../../../../../../../interfaces/IEvaluaciones';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient) {}

	public delete(comport: IComportamiento): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/comportamientos/${comport.id}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas los comportamientos del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los comportamientos
	 */
	public getAllComport(): Promise<IComportamiento[]> {
		return this.httpClient.get<IComportamiento[]>(`${cnf.apiURL}/comportamientos/all`).toPromise();
	}

	/**
	 * Metodo que borra una comportamiento del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarComportort(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/comportamientos/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			//TODO: Excepción si hay error lanzar a controlador (Componente)
			alert('No se ha podido borrar ese comportamiento, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new comportamiento to the server */
	addComport(comp: IComportamiento): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/comportamientos`, comp).toPromise();
	}

	/**
	 *
	 * @param comport El comportamiento a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
		 editCompt(comport: IComportamiento): Promise<boolean> {
			return this.httpClient.put<boolean>(`${cnf.apiURL}/comportamientos`, comport).toPromise();
		}
}
