import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IAuthTokenRes, IRegisterRequestDTO, ISignInDto } from 'sharedInterfaces/DTO';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	constructor(private httpClient: HttpClient, private jwtSv: JwtService) {}

	/**
	 * Function that send the login information to api and set the jwt token if the information given is valid
	 *
	 * @param body Is the json object with username and password, email optional
	 * @return Return `true` if successful authentication, otherwise return `false`.
	 */
	async sendLoginInfo(body: ISignInDto): Promise<IAuthTokenRes> {
		return firstValueFrom(this.httpClient.post<IAuthTokenRes>(cnf.API_URL + '/signin', body));
	}

	/**
	 *
	 * @param body  El cuerpo a enviar en la petición de registro
	 * @returns Promise q se resuelve como `true` si todo ha ido bien, `false` en caso contrario
	 */
	async sendRegisterReq(body: IRegisterRequestDTO): Promise<boolean> {
		const response: IAuthTokenRes = await firstValueFrom(
			this.httpClient.post<IAuthTokenRes>(cnf.API_URL + '/signup', body),
		);
		console.log(response);
		if (!response) {
			return false;
		}
		return true;
	}
}
