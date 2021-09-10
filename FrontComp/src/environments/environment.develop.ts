import { Environment } from './environment-type';

/** Env para desplegar frontal en peciacs-dev */
export const environment: Environment = {
	IN_PRODUCTION: true,
	API_URL: 'http://yourdomain.com/api',
	JWT_INTERVAL: 45000,
	IS_API_URL_DYNAMIC: false,
	API_URL_TO_ADD: undefined,
	JWT_NAME: 'login-token',
	msgLoggerNumber: 200,
};
