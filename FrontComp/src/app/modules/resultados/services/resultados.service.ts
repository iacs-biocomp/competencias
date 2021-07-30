import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IResultadoDTO } from 'sharedInterfaces/DTO';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
	constructor(private readonly httpClient: HttpClient) {}

	getAll(): Promise<IResultadoDTO[]> {
		//LOG: httpDelete a ${apiUrlReq} obteniendo todos los resultados
		return this.httpClient.get<IResultadoDTO[]>(`${cnf.apiURL}/evaluaciones/showing-results`).toPromise();
	}
}
