import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { IComportAddDTO, IComportGetDTO, IComportPutDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<IComportGetDTO[]> {
		const url = `${cnf.API_URL}/comportamientos/all`;
		this.logger.debug(`Obteniendo todos los comportamientos de ${url}`);
		return this.httpClient.get<IComportGetDTO[]>(url).toPromise();
	}

	delete(comport: IComportamiento['id'] | Pick<IComportamiento, 'id'>): Promise<boolean> {
		const id = typeof comport === 'string' ? comport : comport.id;
		const url = `${cnf.API_URL}/comportamientos/${id}`;
		this.logger.debug(`Eliminando comport con ID: ${id}, mandando req a ${url}`);
		return this.httpClient.delete<boolean>(url).toPromise();
	}

	add(comport: IComportAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/comportamientos`;
		this.logger.debug(`Añadiendo un comport con ID: ${comport.id}, POST req a: ${url}`, comport);
		return this.httpClient.post<boolean>(url, comport).toPromise();
	}

	edit(comport: IComportPutDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/comportamientos`;
		this.logger.debug(`Editando el comport con ID: ${comport.id}, PUT req a: ${url}`, comport);
		return this.httpClient.put<boolean>(url, comport).toPromise();
	}

	/**
	 * Obtiene la cuenta de las competencias que existen en la base de datos, usada solo para admin y gestor
	 * TODO: Translate tsdoc
	 */
	getCount(): Promise<number> {
		const url = `${cnf.API_URL}/comportamientos/count`;
		this.logger.debug('Getting count of competencias');
		return this.httpClient.get<number>(url).toPromise();
	}
}
