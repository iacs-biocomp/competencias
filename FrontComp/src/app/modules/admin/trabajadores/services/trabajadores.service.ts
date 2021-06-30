import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ITrabajadorDTO } from 'sharedInterfaces/DTO';
import { ITrabajador, IUser } from 'sharedInterfaces/Entity';

@Injectable({
	providedIn: 'root',
})
export class TrabajadoresService {
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Metodo que obtiene un trabajador del backend por su dni
	 * @param dniOrObj el dni del trabajador a buscar
	 * @returns el trabajador encontrado
	 */
	getOneByDni(dniOrObj: Pick<ITrabajador, 'dni'> | ITrabajador['dni']): Promise<ITrabajador> {
		const dni = typeof dniOrObj === 'string' ? dniOrObj : dniOrObj.dni;
		return this.httpClient.get<ITrabajador>(`${cnf.apiURL}/trabajadores/${dni}`).toPromise();
	}

	/**
	 * Metodo que obtiene un trabajador del backend por su username
	 * @param usrnameOrObj el nombre de usuario del trabajador a buscar
	 * @returns el trabajador encontrado
	 */
	getOneByUsername(usrnameOrObj: Pick<IUser, 'username'> | IUser['username']): Promise<ITrabajador> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		return this.httpClient.get<ITrabajador>(`${cnf.apiURL}/trabajadores/username${username}`).toPromise();
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
	 * TODO: HECHO
	 * @deprecated
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
	 * @deprecated
	 * Elimina un trabajador de la DB indicando su dni
	 * @param worker el trabajador a borrar
	 * @returns devuelve una promesa para eliminar el trabajador
	 */
	delete(worker: Pick<ITrabajador, 'dni'>): Promise<boolean> {
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${worker.dni}`).toPromise();
	}

	/**
	 * Metodo que elimina un trabajador del backend
	 *
	 * @param id el id del trabajador o su dni
	 * @returns una promesa que si es 'true' se ha borrado y 'false' en caso contrario
	 */

	deleteWorker(id: ITrabajador | ITrabajador['dni']): Promise<boolean> {
		const dniWorker = typeof id === 'string' ? id : id.dni;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${dniWorker}`).toPromise();
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
