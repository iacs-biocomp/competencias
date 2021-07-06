import { Roles } from 'sharedInterfaces/Entity';

export interface IJwtToken {
	username: string;
	password: string;
	email?: string;
	roles: Roles[];
	iat: number;
}
