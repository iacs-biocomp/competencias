import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ITrabajadorDTO, ITrabCCompCContrDTO, IUserDTO } from 'sharedInterfaces/DTO';
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
	 * TODO: DTO return type
	 */
	getOneByDni(dniOrObj: ITrabajadorDTO['dni'] | Pick<ITrabajadorDTO, 'dni'>): Promise<ITrabajador> {
		const dni = typeof dniOrObj === 'string' ? dniOrObj : dniOrObj.dni;
		return this.httpClient.get<ITrabajador>(`${cnf.apiURL}/trabajadores/${dni}`).toPromise();
	}

	/**
	 * Metodo que obtiene un trabajador del backend por su username
	 * @param usrnameOrObj el nombre de usuario del trabajador a buscar
	 * @returns el trabajador encontrado
	 * TODO: DTO return type
	 *
	 */
	getOneByUsername(usrnameOrObj: IUserDTO['username'] | Pick<IUserDTO, 'username'>): Promise<IUserDTO> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		return this.httpClient.get<IUserDTO>(`${cnf.apiURL}/trabajadores/username${username}`).toPromise();
	}

	/**
	 * Metodo que obtiene todas los trabajadores del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los trabajadores
	 */
	public getAll(): Promise<ITrabajadorDTO[]> {
		return this.httpClient.get<ITrabajadorDTO[]>(`${cnf.apiURL}/trabajadores/all`).toPromise();
	}

	/**
	 * Metodo que elimina un trabajador del backend
	 *
	 * @param id el id del trabajador o su dni
	 * @returns una promesa que si es 'true' se ha borrado y 'false' en caso contrario
	 */

	async delete(id: ITrabajadorDTO['dni'] | Pick<ITrabajadorDTO, 'dni'>): Promise<boolean> {
		const dniWorker = typeof id === 'string' ? id : id.dni;
		let borrado = false;
		try {
			return await this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${dniWorker}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar ese trabajador, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * Manda una petición de tipo post al servidor intentando añadir el trabajador.
	 *
	 * @returns Una promise que se puede resolver como `true` si se ha añadido el trabajador y `false`/Excepción si no se ha podido añadir
	 * TODO: comprobar DTO parametro correcto?
	 */
	add(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}

	/**
	 *
	 * @param comp El worker con los datos editados
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 * TODO: comprobar DTO parametro correcto?
	 */
	edit(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}
}
