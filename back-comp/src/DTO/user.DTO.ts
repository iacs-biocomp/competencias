import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IUserDTO } from 'sharedInterfaces/DTO';
import { RoleDTO } from './index';

//TODO: Add tsdoc
export class UserDTO implements IUserDTO {
	@Expose()
	@ApiProperty()
	@IsString({ message: 'User.username must be a string' })
	@IsNotEmpty({ message: 'User.username must be defined' })
	username: string;

	@Expose()
	@ApiProperty()
	@IsString({ message: 'User.password must be a string' })
	@IsNotEmpty({ message: 'User.password must be defined' })
	password: string;

	@Expose()
	@ApiProperty()
	@IsString({ message: 'User.email must be a string' })
	@IsNotEmpty({ message: 'User.email must be defined' })
	email: string;

	@Expose()
	@ApiProperty()
	@IsString({ message: 'User.name must be a string' })
	@IsNotEmpty({ message: 'User.name must be defined' })
	name: string;

	@Expose()
	@ApiProperty()
	@IsString({ message: 'User.lastName must be a string' })
	@IsNotEmpty({ message: 'User.lastName must be defined' })
	lastname: string;

	@Expose()
	@ApiProperty()
	@IsDate({ message: 'User.createdAt must be a Date' })
	@IsNotEmpty({ message: 'User.createdAt must be defined' })
	createdAt: Date;

	@Expose()
	@ApiProperty()
	@IsDate({ message: 'User.updatedAt must be a Date' })
	@IsNotEmpty({ message: 'User.updatedAt must be defined' })
	updatedAt: Date;

	@Expose()
	@ApiProperty()
	@IsBoolean({ message: 'User.active must be boolean' })
	@IsNotEmpty({ message: 'User.username must be defined' })
	active: boolean;

	@Expose()
	@Type(() => RoleDTO)
	@ApiProperty({ type: () => [RoleDTO] })
	roles: RoleDTO[];
}
