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
	 * @param dniOrObj The dni of dniOrObj or dniOrObj that will be searched
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear
	 */
	getOneByDni(dniOrObj: ITrabajador['dni'] | Pick<ITrabajador, 'dni'>): Promise<ITrabajadorDTO> {
		const dni = typeof dniOrObj === 'string' ? dniOrObj : dniOrObj.dni;
		return this.httpClient.get<ITrabajadorDTO>(`${cnf.apiURL}/trabajadores/${dni}`).toPromise();
	}

	/**
	 * @param usrnameOrObj The username of usrnameOrObj or dniOrObj that will be searched
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear return
	 *
	 */
	getOneByUsername(usrnameOrObj: IUser['username'] | Pick<IUser, 'username'>): Promise<IUserDTO> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		return this.httpClient.get<IUserDTO>(`${cnf.apiURL}/trabajadores/username${username}`).toPromise();
	}

	/**
	 * Used only by the ADMIN
	 *
	 */
	public getAll(): Promise<ITrabajadorDTO[]> {
		return this.httpClient.get<ITrabajadorDTO[]>(`${cnf.apiURL}/trabajadores/all`).toPromise();
	}

	/**
	 *
	 * @param wrk The wrk of dniWorker or dniWorker that will be deleted
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 */

	delete(wrk: ITrabajador['dni'] | Pick<ITrabajador, 'dni'>): Promise<boolean> {
		const dniWorker = typeof wrk === 'string' ? wrk : wrk.dni;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/trabajadores/${dniWorker}`).toPromise();
	}

	/**
	 *
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear
	 */
	add(worker: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/trabajadores`, worker).toPromise();
	}

	/**
	 *
	 * @param wrk The worker to update
	 * @returns A `Promise` that it's `true` if it has been edited, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear
	 */
	edit(wrk: ITrabajadorDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/trabajadores`, wrk).toPromise();
	}
}
