import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	constructor(private httpClient: HttpClient) {}

	//TODO: Tsdoc
	getUserData(usrnameOrObj: IUser['username'] | Pick<IUser, 'username'>): Promise<IUser> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		return this.httpClient.get<IUser>(`${cnf.apiURL}/users/${username}`).toPromise();
	}
}
