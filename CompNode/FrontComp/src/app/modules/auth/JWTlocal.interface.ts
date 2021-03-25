export interface IJwtToken {
	username: string;
	password: string;
	email?: string;
	roles: [];
	iat: number;
}
