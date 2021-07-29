import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { INivelGetDTO } from 'sharedInterfaces/DTO';

export class NivelGetDTO implements INivelGetDTO {
	@ApiProperty()
	@IsInt({ message: 'NivelGetDTO.id must be an integer' })
	id: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsString({ message: 'NivelGetDTO.code must be a string' })
	code: string;

	@ApiProperty()
	@IsNumber()
	valor: number;

	@ApiProperty()
	@IsNumber()
	minRango: number;

	@ApiProperty()
	@IsNumber()
	maxRango: number;
}
