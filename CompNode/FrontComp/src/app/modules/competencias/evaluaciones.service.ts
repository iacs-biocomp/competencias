import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvaluacion } from '../../../../../interfaces/IEvaluaciones';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class EvaluacionesService {
	constructor(private httpClient: HttpClient) {}

	public evaluacionesUsr(usr: string): Promise<IEvaluacion[]> {
		return this.httpClient.get<IEvaluacion[]>(cnf.apiURL + `/evaluaciones/${usr}`).toPromise();
	}
}
