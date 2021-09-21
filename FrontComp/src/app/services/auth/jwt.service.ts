import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { remove as cookieRm } from 'js-cookie';
import { environment as cnf } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAuthTokenRes, IJwtPayload } from 'sharedInterfaces/DTO';
import { LoginGuard } from '../../guards/login.guard';

@Injectable({
	providedIn: 'root',
})
/** Este servicio contiene todas funciones relacionadas con los jwt, tanto para las cookies como el localStorage */
export class JwtService {
	private refresh = {
		eventOcurred: false,
	};

	constructor(private jwtHelper: JwtHelperService, private httpClient: HttpClient, private router: Router) {}

	/**
	 * Manda el jwt al backend para recibir uno nuevo si: Hay token & No esta expirado
	 * & Ha ocurrido interación del usuario
	 */
	async refreshToken() {
		// LOG: llamado refresh token
		const tkn = this.token();
		if (!tkn) {
			return;
		}
		if (this.jwtHelper.getTokenExpirationDate(tkn)! < new Date()) {
			this.rmToken();
			this.router.navigate([LoginGuard.loginRoute], {
				queryParams: { returnUrl: this.router.url },
			});
			return;
		}
		if (!this.refresh.eventOcurred) {
			return;
		}
		const response: IAuthTokenRes = await this.httpClient
			.post<IAuthTokenRes>(`${cnf.API_URL}/jwtrefresh`, { tokenStr: this.token() })
			.toPromise();
		this.updateJwt(response.token);
		this.refresh.eventOcurred = false;
	}

	/**
	 * Metodo que obtiene el token del localStorage y lo devuelve descodificado
	 *
	 * @returns El token de tipo `IJwtPayload` descodificado
	 */
	getDecodedToken(): IJwtPayload | undefined {
		// LOG: obteniendo token decodificado
		return this.jwtHelper.decodeToken<IJwtPayload>(this.token());
	}

	/**
	 * @returns jwt as string or undefined.
	 */
	getToken(): string | undefined {
		// LOG: logar token
		return this.token();
	}

	/**Metodo que borra el token de las cookies y del localStorage */
	rmToken(): void {
		cookieRm(cnf.JWT_NAME);
		localStorage.removeItem(cnf.JWT_NAME);
	}

	/** Debe ser llamado cuando ha ocurrido un evento que representa interación del usuario  */
	refreshEvent(): void {
		// LOG: refresh event called
		this.refresh.eventOcurred = true;
	}

	/**
	 * Actualiza el jwt del localStorage y de las cookies
	 *
	 * @param token El token firmado y codificado a settear en cookies y localStorage
	 */
	updateJwt(token: string): void {
		localStorage.setItem(cnf.JWT_NAME, token);
		document.cookie = `${cnf.JWT_NAME}=${encodeURIComponent(token)}`;
	}

	/** Token codificado en base64 */
	private token = () => {
		const tkn = localStorage.getItem(cnf.JWT_NAME);
		return tkn === null ? undefined : tkn;
	};
}
