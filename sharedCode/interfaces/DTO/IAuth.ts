import { Roles } from '../Entity';

/**
 * Esta interfaz es la que manda el login al backend, Usuario y contraseña
 */
export interface SignInDto {
	/**El nombre de usuario */
	username: string;
	/**La contraseña sin cifrar del usuario */
	password: string;
}
export interface IRegisterRequestDTO {
	username: string;
	password: string;
	name: string;
	surnames: string;
	DNI: string;
	phone: number;
	institution: string;
	email: string;
	iat?: number;
}


/**
 *El payload (contenido) del JWT de autentificación, tiene username, contraseña (Su hash+salt) y los roles que posee el usuario
 */
export interface IJwtPayload {
	username: string;
	email: string;
	/**El hash con salt de la contraseña del usuario */
	password: string;
	roles: Roles[];
	iat?: Date;
}

//TODO: Tsdoc
export type IAuthTokenRes = {
	token: string;
};
