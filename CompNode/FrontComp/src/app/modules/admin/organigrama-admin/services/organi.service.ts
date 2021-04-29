import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO, ITrabOrgani } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class OrganiService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * Este metodo devuelve el organigrama completo de la base de datos
	 */
	getFullOrgani(): Promise<IOrganigramaUsrDTO[]> {
		return this.httpClient.get<IOrganigramaUsrDTO[]>(`${cnf.apiURL}/organigrama/all`).toPromise();
	}

	setInferiores(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/inferiores/${wrk.dni}`, relations)
			.toPromise();
	}
	setSuperiores(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		return this.httpClient
			.post<boolean>(`${cnf.apiURL}/organigrama/superiores/${wrk.dni}`, relations)
			.toPromise();
	}
	setPares(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/organigrama/pares/${wrk.dni}`, relations).toPromise();
	}
	//TODO: Completar
	// removeSuperiores(): Promise<boolean> {
	// 	return this.httpClient.delete()
	// }
}
