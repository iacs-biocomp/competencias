import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICCompAddDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class CatCompetencialesService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	public async getAll(): Promise<ICCompDTO[]> {
		const url = `${cnf.apiURL}/catcomp/all`;
		this.logger.debug(`Obteniendo todas las cat competenciales de: ${url}`);
		return this.httpClient.get<ICCompDTO[]>(url).toPromise();
	}

	/**
	 *
	 * @param cComp The id of the cComp to delete
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 * @throws TODO: complete
	 */
	async delete(cComp: ICatComp['id'] | Pick<ICatComp, 'id'>): Promise<true> {
		const cCompId = typeof cComp === 'string' ? cComp : cComp.id;
		const url = `${cnf.apiURL}/catcomp/${cCompId}`;
		this.logger.debug(`Eliminando cComp con ID: ${cCompId}, mandando req a: ${url}`);
		return this.httpClient.delete<true>(url).toPromise();
	}

	/**
	 *
	 * @param cComp The catComp to add
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws TODO: complete ()
	 *
	 */
	add(cComp: ICCompAddDTO): Promise<true> {
		const url = `${cnf.apiURL}/catcomp`;
		this.logger.debug(`Añadiendo cComp con ID: ${cComp.id}, POST req a ${url}`, cComp);
		return this.httpClient.post<true>(url, cComp).toPromise();
	}

	/**
	 *
	 * @param catComp the catComp to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 * @throws TODO: complete ()
	 *
	 */
	edit(cComp: ICCompDTO): Promise<true> {
		const url = `${cnf.apiURL}/catcomp`;
		this.logger.debug(`Editando la cComp con ID: ${cComp.id}, PUT req a ${url}`, cComp);
		return this.httpClient.put<true>(url, cComp).toPromise();
	}
}
