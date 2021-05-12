import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrganigramaUsrDTO, ITrabOrgani } from 'sharedInterfaces/DTO/ITrabajadorDTO';
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

	deleteInferiores(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		console.log('xd');
		console.log(wrk, relations);
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/inferiores/${wrk.dni}`, this.getDeleteBody(relations))
			.toPromise();
	}
	deletePares(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/pares/${wrk.dni}`, this.getDeleteBody(relations))
			.toPromise();
	}
	deleteSuperiores(wrk: ITrabOrgani, relations: ITrabOrgani[]): Promise<boolean> {
		return this.httpClient
			.delete<boolean>(`${cnf.apiURL}/organigrama/superiores/${wrk.dni}`, this.getDeleteBody(relations))
			.toPromise();
	}

	/**
	 *
	 * @param relations El objeto a poner en el body
	 * @returns El objeto options  que se le puede pasar al httpClient.delete()
	 */
	private getDeleteBody(relations: ITrabOrgani[]) {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: relations,
		};
	}
}
