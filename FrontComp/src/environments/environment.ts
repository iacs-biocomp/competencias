import { Environment } from './environment-type';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: Environment = {
	IN_PRODUCTION: false,
	IS_API_URL_DYNAMIC: false,
	API_URL_TO_ADD: undefined,
	API_URL: 'http://localhost:3000/api',
	JWT_INTERVAL: 15000,
	JWT_NAME: 'login-token',
	msgLoggerNumber: 300,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.import { Environment } from './environment-type';import { Environment } from './environment-type';
