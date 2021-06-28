/** Tipo usado por los environments para fallar al compilar si se añade alguna propiedad y no es implementada por el resto de environments */
export type Environment = {
	/** Si está en true el comportamiento de la aplicación cambia (logging, performance etc) */
	production: boolean;
	/** `true` si {@link apiUrl} debe cambiar a location.origin `false` se utiliza apiUrl tal cual*/
	isApiUrlDynamic: boolean;
	/** La url en la que se encuentra el backend */
	apiURL: string;
	/** La parte de la url que se suma a location.origin si apiUrl es dinamica */
	apiURLtoAdd: string | undefined;
	/** El intervalo de tiempo en `ms` en el cual se renovará el jwt si ha habido interacción del usuario */
	jwtInterval: number;
};
