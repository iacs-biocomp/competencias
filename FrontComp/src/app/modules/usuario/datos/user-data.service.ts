import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserDTO, IUserGetDTO } from 'sharedInterfaces/DTO';
import { IUser } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Api request that gets user info
	 * @param usrnameOrObj Username or object that have username property
	 * @returns The user info, type IUser
	 * TODO: DONE, testear
	 */
	getUserData(usrnameOrObj: IUserGetDTO['username'] | Pick<IUserGetDTO, 'username'>): Promise<IUserDTO> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		return this.httpClient.get<IUserDTO>(`${cnf.apiURL}/users/${username}`).toPromise();
	}
}
