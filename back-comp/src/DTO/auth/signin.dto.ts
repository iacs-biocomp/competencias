import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ISignInDto } from 'sharedInterfaces/DTO';

export class SigninDTO implements ISignInDto {
	@Expose()
	@IsNotEmpty({ message: 'SigninDTO.username must be provided' })
	@IsString({ message: 'SigninDTO.username must be a string' })
	username: string;

	@Expose()
	@IsNotEmpty({ message: 'SigninDTO.password must be provided' })
	@IsString({ message: 'SigninDTO.password must be a string' })
	password: string;
}
