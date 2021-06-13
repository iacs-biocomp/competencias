import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvAllRequired } from 'sharedInterfaces/DTO';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class EvaluacionesService {
	constructor(private httpClient: HttpClient) {}

	// TODO: Tsdoc
	public evaluacionesUsr(usr: string): Promise<IEvAllRequired[]> {
		return this.httpClient.get<IEvAllRequired[]>(cnf.apiURL + `/evaluaciones/${usr}`).toPromise();
	}
}
