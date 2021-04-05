import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ICompetencia } from "../../../../../interfaces/IEvaluaciones";
import { environment as cnf } from "../../../environments/environment";

@Injectable({
	providedIn: 'root',
})
export class CompetenciasService{
	constructor(private httpClient: HttpClient){}

	public competenciasUsr(competencia: string): Promise<ICompetencia[]>{
		return this.httpClient
			.get<ICompetencia[]>(cnf.apiURL + `/competencias/all`)
			.toPromise();
	}
}
