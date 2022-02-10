import { Environment } from './environment-type';

/** Env para producción */
export const environment: Environment = {
	IN_PRODUCTION: true,
	API_URL: 'http://yourdomainname.com/api',
	JWT_INTERVAL: 45000,
	IS_API_URL_DYNAMIC: true,
	API_URL_TO_ADD: '/api',
	JWT_NAME: 'login-token',
	msgLoggerNumber: 500
};
