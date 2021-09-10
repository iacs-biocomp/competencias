import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ITrabAddDTO, ITrabajadorDTO, ITrabCCompCContrDTO } from 'sharedInterfaces/DTO';
import { ITrabajador, IUser } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({
	providedIn: 'root',
})
export class TrabajadoresService {
	constructor(private readonly httpClient: HttpClient, private readonly logger: LogService) {}

	/**
	 * Used only by the ADMIN
	 *
	 */
	public getAll(): Promise<ITrabCCompCContrDTO[]> {
		const url = `${cnf.API_URL}/trabajadores/all`;
		this.logger.debug(`Obteniendo todos los trabajadores de: ${url}`);
		return this.httpClient.get<ITrabCCompCContrDTO[]>(url).toPromise();
	}

	/**
	 * @param dniOrObj The dni of dniOrObj or dniOrObj that will be searched
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear
	 */
	getOneByDni(dniOrObj: ITrabajador['dni'] | Pick<ITrabajador, 'dni'>): Promise<ITrabajadorDTO> {
		const dni = typeof dniOrObj === 'string' ? dniOrObj : dniOrObj.dni;
		const url = `${cnf.API_URL}/trabajadores/${dni}`;
		this.logger.debug(`Req a: ${url}, obteniendo el trabajador con DNI: ${dni}`);
		return this.httpClient.get<ITrabajadorDTO>(url).toPromise();
	}

	/**
	 * @param usrnameOrObj The username of usrnameOrObj or dniOrObj that will be searched
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE, testear return
	 *
	 */
	getOneByUsername(usrnameOrObj: IUser['username'] | Pick<IUser, 'username'>): Promise<ITrabajadorDTO> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		const url = `${cnf.API_URL}/trabajadores/username/${username}`;
		this.logger.debug(`Req a: ${url}, obteniendo trabajador por username: ${username}`);
		return this.httpClient.get<ITrabajadorDTO>(url).toPromise();
	}

	/**
	 *
	 * @param wrk The wrk of dniWorker or dniWorker that will be deleted
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 */

	delete(wrk: ITrabajador['dni'] | Pick<ITrabajador, 'dni'>): Promise<boolean> {
		const dniWorker = typeof wrk === 'string' ? wrk : wrk.dni;
		const url = `${cnf.API_URL}/trabajadores/${dniWorker}`;
		this.logger.debug(`Eliminando trabajador con DNI: ${dniWorker}, mandando req a: ${url}`);
		return this.httpClient.delete<boolean>(url).toPromise();
	}

	/**
	 *
	 * @returns A `Promise` that it's `true` if it has been getted, exception if not
	 * @throws TODO: exception
	 * TODO: DONE
	 */
	add(worker: ITrabAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/trabajadores`;
		this.logger.debug(`Añadiendo trabajador con DNI: ${worker.dni}, POST req a ${url}`, worker);
		return this.httpClient.post<boolean>(url, worker).toPromise();
	}

	/**
	 *
	 * @param wrk The worker to update
	 * @returns A `Promise` that it's `true` if it has been edited, exception if not
	 * @throws TODO: exception
	 * TODO: DONE,
	 */
	edit(wrk: ITrabAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/trabajadores`;
		this.logger.debug(`Editando datos del trabajador con DNI: ${wrk.dni}, PUT req a ${url}`, wrk);
		return this.httpClient.put<boolean>(url, wrk).toPromise();
	}
}
