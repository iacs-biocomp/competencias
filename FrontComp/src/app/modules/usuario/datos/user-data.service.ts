import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserDTO } from 'sharedInterfaces/DTO';
import { IUser } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({
	providedIn: 'root',
})
export class UserDataService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	/**
	 * Api request that gets user info
	 * @param usrnameOrObj Username or object that have username property
	 * @returns The user info, type IUser
	 * TODO: DONE, testear
	 */
	getUserData(usrnameOrObj: IUser['username'] | Pick<IUser, 'username'>): Promise<IUserDTO> {
		const username = typeof usrnameOrObj === 'string' ? usrnameOrObj : usrnameOrObj.username;
		// LOG: obteniendo datos del usuario ${username}
		const url = `${cnf.apiURL}/users/${username}`;
		this.logger.debug(`Get request a ${url}, obteniendo datos del user: ${username}`);
		return this.httpClient.get<IUserDTO>(url).toPromise();
	}
}
