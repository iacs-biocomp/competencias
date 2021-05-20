import { IsNotEmpty } from 'class-validator';
import { RoleType } from 'sharedInterfaces/DTO';

export class UserDto {
	@IsNotEmpty()
	id: number;

	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	roles: RoleType[];
}
