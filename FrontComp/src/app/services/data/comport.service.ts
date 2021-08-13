import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { IComportAddDTO, IComportGetDTO, IComportPutDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	public getAll(): Promise<IComportGetDTO[]> {
		const url = `${cnf.apiURL}/comportamientos/all`;
		this.logger.debug(`Obteniendo todos los comportamientos de ${url}`);
		return this.httpClient.get<IComportGetDTO[]>(url).toPromise();
	}

	delete(comport: IComportamiento['id'] | Pick<IComportamiento, 'id'>): Promise<boolean> {
		const id = typeof comport === 'string' ? comport : comport.id;
		const url = `${cnf.apiURL}/comportamientos/${id}`;
		this.logger.debug(`Eliminando comport con ID: ${id}, mandando req a ${url}`);
		return this.httpClient.delete<boolean>(url).toPromise();
	}

	add(comport: IComportAddDTO): Promise<boolean> {
		const url = `${cnf.apiURL}/comportamientos`;
		this.logger.debug(`Añadiendo un comport con ID: ${comport.id}, POST req a: ${url}`, comport);
		return this.httpClient.post<boolean>(url, comport).toPromise();
	}

	edit(comport: IComportPutDTO): Promise<boolean> {
		const url = `${cnf.apiURL}/comportamientos`;
		this.logger.debug(`Editando el comport con ID: ${comport.id}, PUT req a: ${url}`, comport);
		return this.httpClient.put<boolean>(url, comport).toPromise();
	}
}
