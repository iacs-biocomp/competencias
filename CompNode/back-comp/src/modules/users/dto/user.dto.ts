import { IsNotEmpty } from 'class-validator';
import { Roles } from 'sharedInterfaces/Entity';

export class UserDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	roles: Roles[];
}
