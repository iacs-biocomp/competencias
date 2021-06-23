import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IAuthLogin, IRegisterRequest } from './auth.intefaces';
import { JwtService } from 'src/app/services/jwt.service';

export type IAuthTokenRes = {
	token: string;
};
//TODO: Llevar a environment.ts
export const JWT_NAME = 'login-token';

@Injectable()
export class AuthService {
	constructor(private httpClient: HttpClient, private jwtSv: JwtService) {}

	/**
	 * Function that send the login information to api and set the jwt token if the information given is valid
	 *
	 * @param body Is the json object with username and password, email optional
	 * @return Return `true` if successful authentication, otherwise return `false`.
	 */
	async sendLoginInfo(body: IAuthLogin): Promise<boolean> {
		const response: IAuthTokenRes = await this.httpClient
			.post<IAuthTokenRes>(cnf.apiURL + '/signin', body)
			.toPromise();
		if (!response) {
			return false;
		}
		this.setToken(response.token);
		document.cookie = JWT_NAME + '=' + encodeURIComponent(response.token);
		return true;
	}

	/**
	 *
	 * @param body  El cuerpo a enviar en la petición de registro
	 * @returns Promise q se resuelve como `true` si todo ha ido bien, `false` en caso contrario
	 */
	async sendRegisterReq(body: IRegisterRequest): Promise<boolean> {
		const response: IAuthTokenRes = await this.httpClient
			.post<IAuthTokenRes>(cnf.apiURL + '/signup', body)
			.toPromise();
		console.log(response);
		if (!response) {
			return false;
		}
		return true;
	}

	/**
	 * Guarda un token en el localStorage `key:value` La key (nombre del token) viene dado por env variable
	 * @param token El token jwt firmado
	 */
	setToken(token: string): void {
		this.jwtSv.updateJwt(token);
	}
}
