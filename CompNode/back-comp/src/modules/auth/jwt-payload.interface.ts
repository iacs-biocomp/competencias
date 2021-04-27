import { RoleType } from '../role/roletype.enum';

export interface IJwtPayload {
	username: string;
	email: string;
	password: string;
	roles: RoleType[];
	iat?: Date;
	exp?: Date;
}
