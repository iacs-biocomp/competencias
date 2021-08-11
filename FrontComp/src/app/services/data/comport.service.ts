import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { IComportAddDTO, IComportGetDTO, IComportPutDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient) {}

	public getAll(): Promise<IComportGetDTO[]> {
		//LOG: httpGet a ${apiUrlReq} obteniendo todos los comportamientos
		return this.httpClient.get<IComportGetDTO[]>(`${cnf.apiURL}/comportamientos/all`).toPromise();
	}

	delete(comport: IComportamiento['id'] | Pick<IComportamiento, 'id'>): Promise<boolean> {
		//LOG: `se elimina un comport ${comport}`
		const id = typeof comport === 'string' ? comport : comport.id;
		return this.httpClient.delete<boolean>(`${cnf.apiURL}/comportamientos/${id}`).toPromise();
	}

	add(comp: IComportAddDTO): Promise<boolean> {
		//LOG: `se añade un comport ${comp}`
		return this.httpClient.post<boolean>(`${cnf.apiURL}/comportamientos`, comp).toPromise();
	}

	edit(comport: IComportPutDTO): Promise<boolean> {
		//LOG: `se edita un comport ${comport}`
		return this.httpClient.put<boolean>(`${cnf.apiURL}/comportamientos`, comport).toPromise();
	}
}
