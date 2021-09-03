import { Environment } from './environment-type';

/** Env para desplegar frontal en peciacs-dev */
export const environment: Environment = {
	production: true,
	apiURL: 'http://yourdomain.com/api',
	jwtInterval: 45000,
	isApiUrlDynamic: false,
	apiURLtoAdd: undefined,
	jwtName: 'login-token',
	msgLoggerNumber: 200,
};
