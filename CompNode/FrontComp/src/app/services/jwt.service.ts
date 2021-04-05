import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_NAME } from '../modules/auth/auth.service';
import { IJwtToken } from '../modules/auth/JWTlocal.interface';
import { remove as cookieRm } from 'js-cookie';

@Injectable({
	providedIn: 'root',
})
/** Este servicio contiene todas funciones relacionadas con los jwt, tanto para las cookies como el localStorage */
export class JwtService {
	constructor(private jwtHelper: JwtHelperService) {}
	/** Token codificado en base64 */
	token: string = localStorage.getItem(JWT_NAME)!;

	/**
	 * Metodo que obtiene el token del localStorage y lo devuelve descodificado
	 * @returns El token de tipo `IJwtToken` descodificado
	 */
	getDecodedToken(): IJwtToken {
		return this.jwtHelper.decodeToken<IJwtToken>(this.token);
	}

	/**Metodo que borra el token de las cookies y del localStorage */
	rmToken(): void {
		localStorage.removeItem(JWT_NAME);
		cookieRm(JWT_NAME);
	}
}
