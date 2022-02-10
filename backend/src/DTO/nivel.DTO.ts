import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { INivelGetDTO } from 'sharedInterfaces/DTO';

export class NivelGetDTO implements INivelGetDTO {
	@ApiProperty()
	@Expose()
	@IsInt({ message: 'NivelGetDTO.id must be an integer' })
	id: number;

	@ApiProperty()
	@Expose()
	@IsNotEmpty()
	@IsString({ message: 'NivelGetDTO.code must be a string' })
	code: string;

	@ApiProperty()
	@Expose()
	@IsNumber({}, { message: 'NivelGetDTO.valor must be a number' })
	valor: number;

	@ApiProperty()
	@Expose()
	@IsNumber({}, { message: 'NivelGetDTO.minRango must be a number' })
	minRango: number;

	@ApiProperty()
	@Expose()
	@IsNumber({}, { message: 'NivelGetDTO.maxRango must be a number' })
	maxRango: number;
}
