export const environment = {
	production: true,
	/**URL donde la api (nest) estará localizada en producción. */
	apiURL: 'http://yourdomainname.com/nest',
	/** El intervalo de tiempo en `ms` en el cual se renovará el jwt si ha habido interacción del usuario */
	jwtInterval: 45000,
};
