import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { ICatContr } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatContractService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<ICContrAndCCompDTO[]> {
		const url = `${cnf.API_URL}/catcontr/all`;
		this.logger.debug(`Obteniendo todas las categorías contractuales de: ${url}`);
		return firstValueFrom(this.httpClient.get<ICContrAndCCompDTO[]>(url));
	}

	/**
	 *
	 * @param cContr The id of cContr or cContr that will be deleted
	 * @returns A {@link Promise} that resolves as `true` if it has been deleted, rejected otherwise
	 *
	 */
	delete(cContr: ICatContr['id'] | Pick<ICatContr, 'id'>): Promise<boolean> {
		const cContrId = typeof cContr === 'string' ? cContr : cContr.id;
		const url = `${cnf.API_URL}/catcontr/${cContrId}`;
		this.logger.debug(`Eliminando cContr con ID: ${cContrId}, mandando req a: ${url}`);
		return firstValueFrom(this.httpClient.delete<boolean>(url));
	}

	/**
	 *
	 * @param catContract The cContr to add
	 * @returns A {@link Promise} that resolves as `true` if it has been deleted, rejected otherwise
	 *
	 */
	add(cContr: ICContrAddDTO): Promise<boolean> {
		const url = `${cnf.API_URL}/catcontr`;
		this.logger.debug(`Añadiendo cContr con ID: ${cContr.id}, POST req a ${url}`, cContr);
		return firstValueFrom(this.httpClient.post<boolean>(url, cContr));
	}

	/**
	 *
	 * @param cContr the catContract to edit in the ddbb
	 * @returns A {@link Promise} that resolves as `true` if it has been deleted, rejected otherwise
	 *
	 */
	update(cContr: ICContrAndCCompDTO): Promise<true> {
		const url = `${cnf.API_URL}/catcontr`;
		this.logger.debug(`Actualizando datos de la cContr con ID: ${cContr.id}, PUT req a ${url}`, cContr);
		return firstValueFrom(this.httpClient.put<true>(url, cContr));
	}
}
