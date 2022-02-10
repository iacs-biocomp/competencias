import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ICompAddDTO, ICompBaseDTO, ICompGetDTO } from 'sharedInterfaces/DTO';

abstract class CompBaseDTO implements ICompBaseDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Competence.ID cannot be undefined | null' })
	@IsString({ message: 'Competence.ID must be a string' })
	id!: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Undefined | null Competence.description, must be defined' })
	@IsString({ message: 'Description must be a string' })
	descripcion!: string;
}

export class CompAddDTO extends CompBaseDTO implements ICompAddDTO {}

export class CompGetDTO extends CompBaseDTO implements ICompGetDTO {
	@ApiProperty()
	@Type(() => Date)
	@Expose()
	createdAt: Date;
}
