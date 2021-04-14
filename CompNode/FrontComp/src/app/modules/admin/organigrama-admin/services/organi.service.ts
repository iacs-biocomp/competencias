import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO } from '../../../../../../../interfaces/DTO/ITrabajadorDTO';
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
}
