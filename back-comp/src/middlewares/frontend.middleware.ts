import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { Configuration as cnf } from '../config/config.keys';
import { parse } from 'cookie';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { Roles } from 'sharedInterfaces/Entity';

type ModulesObj = { [key: string]: [Roles] };

/**
 * Middleware para el modulo `ServeStaticModule`
 * Divide entre peticiones al API o a este modulo (Autoriza/rechaza el envío de archivos de la SPA)
 */
@Injectable()
export class FrontendMiddleware implements NestMiddleware {
	TOKEN_NAME = this.cnfService.get(cnf.JWT_NAME);
	JWT_KEY = this.cnfService.get(cnf.JWT_SECRET);
	LOGIN_URL = '/auth/login';
	/**Definición de los modulos js (angular) y los roles con los que se puede acceder */
	MODULES: ModulesObj = {
		'/src_app_modules_admin_admin_module_ts.js': [Roles.ADMIN],
	};

	constructor(private authGuard: AuthGuard, private cnfService: ConfigService) {}
	use(req: Request, res: Response, next: Function) {
		const URL = req.baseUrl;
		//Petición api
		if (URL.indexOf('/api') === 0) {
			next();
		}
		//Petición web
		else if (this.MODULES[URL]) {
			const cookieStr = req.headers.cookie;
			const cookies = !!cookieStr ? parse(cookieStr) : {};
			//Comprobar que esta el jwt en cookies
			if (!cookies[this.TOKEN_NAME]) {
				return res.redirect(this.LOGIN_URL);
			}
			//Validar JWT
			if (!this.authGuard.canActivate(cookies[this.TOKEN_NAME], this.JWT_KEY)) {
				return res.redirect(this.LOGIN_URL);
			}
			next();
		} else {
			next();
		}
	}
}
