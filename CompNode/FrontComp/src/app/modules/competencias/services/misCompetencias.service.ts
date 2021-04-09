import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICompetencia } from '../../../../../../interfaces/ICategorias';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	constructor(private httpClient: HttpClient) {}
	getUserData(username: string): Promise<ICompetencia> {
		return this.httpClient.get<ICompetencia>(`${cnf.apiURL}/users/${username}`).toPromise();
	}
}
