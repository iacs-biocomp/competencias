/** Type used by all environments, created for type safety */
export type Environment = {
	/** Si está en true el comportamiento de la aplicación cambia (logging, performance etc) */
	IN_PRODUCTION: boolean;
	/** `true` si {@link apiUrl} debe cambiar a location.origin `false` se utiliza apiUrl tal cual*/
	IS_API_URL_DYNAMIC: boolean;
	/** La url en la que se encuentra el backend */
	API_URL: string;
	/** La parte de la url que se suma a location.origin si apiUrl es dinamica */
	API_URL_TO_ADD: string | undefined;
	/** El intervalo de tiempo en `ms` en el cual se renovará el jwt si ha habido interacción del usuario */
	JWT_INTERVAL: number;
	/** Nombre que se le da a la cookie/objeto guardado en las cookies/localStorage (Usado para buscar luego por clave-valor)*/
	JWT_NAME: string;
	/** Numero de mensajes que el logger guardará en su array interno */
	msgLoggerNumber: number;
};
