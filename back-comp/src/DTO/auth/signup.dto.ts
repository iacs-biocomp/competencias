import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupDTO {
	@IsNotEmpty({ message: 'SignupDTO.username must be provided' })
	@IsString()
	username: string;

	@IsNotEmpty({ message: 'SignupDTO.email must be provided' })
	@IsString()
	email: string;

	@IsNotEmpty({ message: 'SignupDTO.password must be provided' })
	@IsString()
	password: string;

	@IsNotEmpty({ message: 'SignupDTO.name must be provided' })
	@IsString()
	name: string;

	@IsNotEmpty({ message: 'SignupDTO.surnames must be provided' })
	@IsString()
	surnames: string;

	@IsNotEmpty({ message: 'SignupDTO.DNI must be provided' })
	@IsString()
	DNI: string;

	@IsNotEmpty({ message: 'SignupDTO.phone must be provided' })
	@IsNumber()
	phone: number;

	@IsNotEmpty({ message: 'SignupDTO.institution must be provided' })
	@IsString({ message: 'SignupDTO.institution must be a string' })
	institution: string;

	iat?: number;
}
