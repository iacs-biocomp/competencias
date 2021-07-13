import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LogService {
	constructor(private readonly httpClient: HttpClient) {}
	private log(params: any[]) {
		// TODO: Obligatorio o recomendable mandar error T extends Error (Java) mirar en ts. en logger.error para mandar stacktrace a backend
		console.log(params);
	}
}
