import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class CompetenciasService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	public getAll(): Promise<ICompGetDTO[]> {
		const url = `${cnf.apiURL}/competencias/all`;
		this.logger.debug(`Obteniendo todas las competencias de: ${url}`);
		return this.httpClient.get<ICompGetDTO[]>(url).toPromise();
	}

	/**
	 *
	 * @param comp The id of the competencia that will be deleted
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 */
	delete(comp: ICompetencia['id'] | Pick<ICompetencia, 'id'>): Promise<boolean> {
		const compId = typeof comp === 'string' ? comp : comp.id;
		const url = `${cnf.apiURL}/competencias/${compId}`;
		this.logger.debug(`Eliminando comp con ID: ${compId}, mandando req a: ${url}`);
		return this.httpClient.delete<boolean>(url).toPromise();
	}

	/**
	 *
	 * @param comp The competencia to add
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws TODO: complete
	 */
	add(comp: ICompAddDTO): Promise<boolean> {
		const url = `${cnf.apiURL}/competencias`;
		this.logger.debug(`Añadiendo comp con ID: ${comp.id}, POST req a: ${url}`, comp);
		return this.httpClient.post<boolean>(url, comp).toPromise();
	}

	/**
	 *
	 * @param comp the competencia to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 *
	 */
	edit(comp: ICompAddDTO): Promise<boolean> {
		const url = `${cnf.apiURL}/competencias`;
		this.logger.debug(`Editando la comp con ID: ${comp.id}, PUT req a: ${url}`, comp);
		return this.httpClient.put<boolean>(url, comp).toPromise();
	}
}
