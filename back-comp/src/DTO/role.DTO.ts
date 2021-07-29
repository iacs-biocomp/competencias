import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IRoleDTO } from 'sharedInterfaces/DTO';

export class RoleDTO implements IRoleDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.id must not be empty' })
	@IsInt({ message: 'Role.id must be a integer' })
	id: number;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.name must not be empty' })
	@IsString({ message: 'Role.name must be a string' })
	name: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.description must not be empty' })
	@IsString({ message: 'Role.description must be a string' })
	description: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.status must not be empty' })
	@IsString({ message: 'Role.status must be a string' })
	status: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.createdAt must not be empty' })
	@IsDate({ message: 'Role.createdAt must be a Date' })
	createdAt: Date;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Role.updatedAt must not be empty' })
	@IsDate({ message: 'Role.updatedAt must be a Date' })
	updatedAt: Date;
}
