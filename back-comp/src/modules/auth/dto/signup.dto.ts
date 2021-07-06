import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	surnames: string;

	@IsNotEmpty()
	@IsString()
	DNI: string;

	@IsNotEmpty()
	@IsNumber()
	phone: number;

	@IsNotEmpty()
	@IsString()
	institution: string;

	iat?: number;
}
