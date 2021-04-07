import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserJson } from '../../../../../../interfaces/IUser';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	constructor(private httpClient: HttpClient) {}
	getUserData(username: string): Promise<IUserJson> {
		return this.httpClient.get<IUserJson>(cnf.apiURL + '/users/' + username).toPromise();
	}
}
