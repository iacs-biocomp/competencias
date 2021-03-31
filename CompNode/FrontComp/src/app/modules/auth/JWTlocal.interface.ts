export interface IJwtToken {
	username: string;
	password: string;
	email?: string;
	roles: string[];
	iat: number;
}
