import { Environment } from './environment-type';

/** Env para producción */
export const environment: Environment = {
	production: true,
	/**URL donde la api (nest) estará localizada en producción. */
	apiURL: 'http://yourdomainname.com/api',
	/** El intervalo de tiempo en `ms` en el cual se renovará el jwt si ha habido interacción del usuario */
	jwtInterval: 45000,
	isApiUrlDynamic: true,
	apiURLtoAdd: '/api',
	jwtName: 'login-token',
	msgLoggerNumber: 500
};
