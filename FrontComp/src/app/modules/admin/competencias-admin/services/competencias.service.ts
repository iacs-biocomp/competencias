import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';

@Injectable({ providedIn: 'root' })
export class CompetenciasService {
	constructor(private httpClient: HttpClient) {}

	public getAll(): Promise<ICompGetDTO[]> {
		//LOG: `se obtienen todas las competencias`
		return this.httpClient.get<ICompGetDTO[]>(`${cnf.apiURL}/competencias/all`).toPromise();
	}

	/**
	 *
	 * @param cComp The id of the competencia that will be deleted
	 * @returns A `Promise` that it's `true` if it has been deleted, exception if not
	 */
	delete(comp: ICompetencia['id'] | Pick<ICompetencia, 'id'>): Promise<boolean> {
		//LOG: `se elimina una competencia ${compet}`
		const compId = typeof comp === 'string' ? comp : comp.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/competencias/${compId}`).toPromise();
	}

	/**
	 *
	 * @param comp The competencia to add
	 * @returns A `Promise` that it's `true` if it has been added, exception if not
	 * @throws TODO: complete
	 */
	add(comp: ICompAddDTO): Promise<boolean> {
		//LOG: `se añade una comp ${comp}`
		return this.httpClient.post<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}

	/**
	 *
	 * @param comp the competencia to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 *
	 */
	edit(comp: ICompAddDTO): Promise<boolean> {
		//LOG: `se edita una comp ${comp}`
		return this.httpClient.put<boolean>(`${cnf.apiURL}/competencias`, comp).toPromise();
	}
}
