import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ICompAddDTO, ICompGetDTO } from 'sharedInterfaces/DTO';

//TODO: Tsdoc, similar as CompAddDTO
abstract class CompBaseDTO implements ICompGetDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Competence.ID cannot be undefined | null' })
	id!: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Undefined | null Competence.description, must be defined' })
	@IsString({ message: 'Description must be a string' })
	descripcion!: string;
}

export class CompAddDTO extends CompBaseDTO implements ICompAddDTO {}

export class CompGetDTO extends CompBaseDTO implements ICompGetDTO {}
