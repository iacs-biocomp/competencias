import { RoleType } from './roletype.enum';
/**
 * Esta interfaz es la que manda el login al backend, Usuario y contraseña
 */
export interface signInDto {
	/**El nombre de usuario */
	username: string;
	/**La contraseña sin cifrar del usuario */
	password: string;
}

/**
 *El payload (contenido) del JWT de autentificación, tiene username, contraseña (Su hash+salt) y los roles que posee el usuario
 */
export interface IJwtPayload {
	username: string;
	email: string;
	/**El hash con salt de la contraseña del usuario */
	password: string;
	roles: RoleType[];
	iat?: Date;
}
