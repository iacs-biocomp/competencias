export interface IAuthLogin {
	username: string;
	password: string;
	email?: string;
	iat?: number;
}
export interface IRegisterRequest {
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
