import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompetenciasService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<ICompGetDTO[]> {
		const url = `${cnf.API_URL}/competencias/all`;
		this.logger.debug(`Obteniendo todas las competencias de: ${url}`);
		return firstValueFrom(this.httpClient.get<ICompGetDTO[]>(url));
	}

	/**
	 *
	 * @param comp The id of the competence that will be deleted
	 * @returns A {@link Promise} which resolves as `true` if it has been deleted, rejected otherwise
	 */
	delete(comp: ICompetencia['id'] | Pick<ICompetencia, 'id'>): Promise<boolean> {
		const compId = typeof comp === 'string' ? comp : comp.id;
		const url = `${cnf.API_URL}/competencias/${compId}`;
		this.logger.debug(`Eliminando comp con ID: ${compId}, mandando req a: ${url}`);
		return firstValueFrom(this.httpClient.delete<boolean>(url));
	}

	/**
	 *
	 * @param comp The competence to add
	 * @returns A {@link Promise} which resolves as `true` if it has been added, rejected otherwise
	 */
	add(comp: ICompAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/competencias`;
		this.logger.debug(`Añadiendo comp con ID: ${comp.id}, POST req a: ${url}`, comp);
		return firstValueFrom(this.httpClient.post<boolean>(url, comp));
	}

	/**
	 *
	 * @param comp The competence with properties already edited.
	 * @returns A {@link Promise} which resolves as `true` if it has been edited, rejected otherwise
	 *
	 */
	edit(comp: ICompAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/competencias`;
		this.logger.debug(`Editando la comp con ID: ${comp.id}, PUT req a: ${url}`, comp);
		return firstValueFrom(this.httpClient.put<boolean>(url, comp));
	}

	/**
	 * Obtiene la cuenta de las competencias que existen en la base de datos, usada solo para admin y gestor
	 * TODO: Translate tsdoc
	 */
	getCount(): Promise<number> {
		const url = `${cnf.API_URL}/competencias/count`;
		this.logger.debug('Getting count of competencias');
		return firstValueFrom(this.httpClient.get<number>(url));
	}
}
