import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IJwtToken } from '../modules/auth/JWTlocal.interface';
import { Roles } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';
import { JwtService } from '../services/auth/jwt.service';
import { CompRoute } from '../types/angular-modified-types';
import { intersection } from 'lodash';

@Injectable()
export class LoginGuard implements CanLoad {
	//En caso de usar una ruta varias veces guardarla en una variable, si son mas en un objeto.
	public static readonly loginRoute = '/auth/login';

	constructor(
		private readonly jwtHelperSv: JwtHelperService,
		private readonly router: Router,
		private readonly jwtSv: JwtService,
	) {}

	canLoad(route: CompRoute): boolean {
		const token = this.jwtSv.getToken();
		/**
		 * Redirige al usuario al login, añadiendo como parametro la url solicitada para poder volver al logarse
		 * @see [Tutorial seguido](https://bit.ly/3qfwR4V)
		 */
		const toLogin = () =>
			this.router.navigate([LoginGuard.loginRoute], {
				queryParams: { returnUrl: route.path },
			});

		const conditionsToLogin =
			// Route does not contain data
			!route.data ||
			// Or not requires any role
			!route.data.roles ||
			// Or (token exist and isn't expired and has one or more roles that route requires).
			(!!token &&
				!this.jwtHelperSv.isTokenExpired(token) &&
				intersection(this.jwtHelperSv.decodeToken<IJwtToken>(token).roles, route.data.roles).length > 0);

		if (conditionsToLogin) {
			return true;
		} else {
			toLogin();
			return false;
		}
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
	hasRole(role: Roles): boolean {
		const token = this.jwtSv.getToken();
		if (
			!!token &&
			!this.jwtHelperSv.isTokenExpired(token) &&
			this.jwtHelperSv.decodeToken<IJwtToken>(token).roles.includes(role)
		) {
			return true;
		} else {
			return false;
		}
	}
}
