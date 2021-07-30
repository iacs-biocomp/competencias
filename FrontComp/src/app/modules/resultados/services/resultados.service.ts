import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * TODO: tsdoc
	 * @param usr
	 */
	getResultsOfUsr(usr: string): void {
		//TODO: implementar fetch de resultados, dto probablemente sin hacer
	}
}
