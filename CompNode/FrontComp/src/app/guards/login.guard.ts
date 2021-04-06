import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { JWT_NAME } from '../modules/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IJwtToken } from '../modules/auth/JWTlocal.interface';
import { Role } from '../../../../interfaces/IUser';

@Injectable()
export class LoginGuard implements CanLoad {
	//En caso de usar una ruta varias veces guardarla en una variable, si son mas en un objeto.
	static loginRoute = '/auth/login';

	constructor(private jwtService: JwtHelperService, private router: Router) {}

	canLoad(route: Route): boolean {
		const token: string = localStorage.getItem(JWT_NAME)!;

		/**Redirige al usuario al login, añadiendo como parametro la url solicitada para poder volver al logarse
		 * @see [Tutorial seguido](https://bit.ly/3qfwR4V) */
		const toLogin = () =>
			this.router.navigate([LoginGuard.loginRoute], {
				queryParams: { returnUrl: route.path },
			});
		if (!route.data!.roles) {
			return true;
		}
		if (!token || this.jwtService.isTokenExpired(token)) {
			toLogin();
			return false;
		}
		if (
			this.jwtService
				.decodeToken<IJwtToken>(token)
				.roles.filter((role) => route.data!.roles.includes(role)).length > 0
		) {
			return true;
		}
		toLogin();
		return false;
	}

	/**
	 * Metodo que comprueba si en el jwt el usuario tiene el rol introducido como parametro.
	 * Este metodo adquiere el token del localStorage.
	 *
	 * No le pide al backend información para ver si el token es valido, es decir usarlo solo para la interfaz no para auth
	 *
	 * @param role El rol a comprobar en el jwt
	 * @returns `True` si el rol esta en el token y `false` en caso contrario
	 */
	//TODO: Añadir una interfaz que defina los roles que se guardan en la base de datos para no ser genericos con el string (Enum vale tambien)
	hasRole(role: string): boolean {
		const token: string = localStorage.getItem(JWT_NAME)!;
		if (!token || this.jwtService.isTokenExpired(token)) {
			return false;
		}
		if (this.jwtService.decodeToken<IJwtToken>(token).roles.includes(role)) {
			return true;
		}
		return false;
	}
}
