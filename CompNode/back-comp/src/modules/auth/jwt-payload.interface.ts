import { RoleType } from 'sharedInterfaces/DTO';
export interface IJwtPayload {
	username: string;
	email: string;
	password: string;
	roles: RoleType[];
	iat?: Date;
	exp?: Date;
}
