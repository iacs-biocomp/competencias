import { IsNotEmpty, IsString } from 'class-validator';
import { ISignInDto } from 'sharedInterfaces/DTO';

export class SigninDTO implements ISignInDto {
	@IsNotEmpty({ message: 'SigninDTO.username must be provided' })
	@IsString({ message: 'SigninDTO.username must be a string' })
	username: string;

	@IsNotEmpty({ message: 'SigninDTO.password must be provided' })
	@IsString({ message: 'SigninDTO.password must be a string' })
	password: string;
}
