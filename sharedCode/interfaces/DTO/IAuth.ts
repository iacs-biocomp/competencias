import { Roles } from '../Entity';

/**
 * Esta interfaz es la que manda el login al backend, Usuario y contraseña
 */
export interface ISignInDto {
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
 *	El payload (contenido) del JWT de autentificación, tiene username, contraseña (Su hash+salt) y los roles que posee el usuario
 */
export interface IJwtPayload {
	username: string;
	email: string;
	/** Password hash+salt */
	password: string;
	roles: Roles[];
	/** Have to parse, stringified as number */
	iat: Date;
	/** Have to parse, stringified as number */
	exp: Date;
}

//TODO: Tsdoc
export type IAuthTokenRes = {
	token: string;
};
