import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { Configuration as cnf } from '../config/config.keys';
import { parse } from 'cookie';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../guards/auth/auth.guard';

/**
 * Middleware para el modulo `ServeStaticModule`
 * Divide entre peticiones al API o a este modulo (Autoriza/rechaza el envío de archivos de la SPA)
 */
@Injectable()
export class FrontendMiddleware implements NestMiddleware {
	constructor(private authGuard: AuthGuard, private cnfService: ConfigService) {}
	use(req: Request, res: Response, next: Function) {
		const URL = req.baseUrl;
		const TOKEN_NAME = this.cnfService.get(cnf.JWT_NAME);
		const JWT_KEY = this.cnfService.get(cnf.JWT_SECRET);
		const LOGIN_URL = '/auth/login';

		/**Definición de los modulos js (angular) y los roles con los que se puede acceder */
		const MODULOS = {
			'/modules-activity-activity-module.js': 'ADMIN',
		};
		//Petición api
		if (URL.indexOf('/nest') === 0) {
			next();
		}
		//Petición web
		else if (MODULOS[URL]) {
			const cookieStr = req.headers.cookie;
			const cookies = cookieStr ? parse(cookieStr) : {};
			//Comprobar que esta el jwt en cookies
			if (!cookies[TOKEN_NAME]) {
				return res.redirect(LOGIN_URL);
			}
			//Validar JWT
			if (!this.authGuard.canActivate(cookies[TOKEN_NAME], JWT_KEY)) {
				return res.redirect(LOGIN_URL);
			}
			next();
		} else {
			next();
		}
		// TODO: Encapsular en modulo y juntar con libreria MidasJs.
	}
}
