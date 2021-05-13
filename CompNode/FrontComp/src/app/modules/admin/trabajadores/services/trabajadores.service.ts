import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ITrabajadorDTO } from 'sharedInterfaces/DTO';

@Injectable({
	providedIn: 'root',
})
export class TrabajadoresService {
	constructor(private httpClient: HttpClient) {}

	delete(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${worker.dni}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas los trabajadores del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los trabajadores
	 */
	public getAllTrabajadores(): Promise<ITrabajadorDTO[]> {
		return this.httpClient.get<ITrabajadorDTO[]>(`${cnf.apiURL}/trabajadores/all`).toPromise();
	}

	/**
	 * Metodo que borra un worker del backend
	 *
	 * @throws Excepción http si la petición sale mal
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarTrabajador(id: string): Promise<boolean> {
		let borrado = false;
		borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${id}`).toPromise();
		//Si la petición delete sale mal lanza excepción
		return borrado;
	}

	/**
	 * Manda una petición de tipo post al servidor intentando añadir el trabajador.
	 *
	 * @returns Una promise que se puede resolver como `true` si se ha añadido el trabajador y `false`/Excepción si no se ha podido añadir
	 */
	addTrabajador(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}
	/**
	 *
	 * @param comp El worker con los datos editados
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	editTrabajador(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}
}
