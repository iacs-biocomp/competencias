import { Roles } from 'sharedInterfaces/Entity';

export interface IJwtPayload {
	username: string;
	email: string;
	password: string;
	roles: Roles[];
	iat?: Date;
	exp?: Date;
}
