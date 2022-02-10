import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupDTO {
	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.username must be provided' })
	@IsString()
	username: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.email must be provided' })
	@IsString()
	email: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.password must be provided' })
	@IsString()
	password: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.name must be provided' })
	@IsString()
	name: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.surnames must be provided' })
	@IsString()
	surnames: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.DNI must be provided' })
	@IsString()
	DNI: string;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.phone must be provided' })
	@IsNumber()
	phone: number;

	@Expose()
	@IsNotEmpty({ message: 'SignupDTO.institution must be provided' })
	@IsString({ message: 'SignupDTO.institution must be a string' })
	institution: string;

	iat?: number;
}
