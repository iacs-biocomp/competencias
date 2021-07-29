import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ITrabCCompCContrDTO } from 'sharedInterfaces/DTO';

export class TrabCCompCContrDTO implements ITrabCCompCContrDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.Dni must be defined' })
	@IsString({ message: 'Trab.Dni should be a string' })
	dni: string;

	@ApiProperty()
	@Expose()
	@IsString({ message: 'Trab.nombre should be a string' })
	@IsNotEmpty({ message: 'Trab.nombre must be defined' })
	nombre: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.apellidos must be defined' })
	@IsString({ message: 'Trab.apellidos should be a string' })
	apellidos: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.area must be defined' })
	@IsString({ message: 'Trab.area should be a string' })
	area: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.unidad must be defined' })
	@IsString({ message: 'Trab.unidad should be a string' })
	unidad: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.departamento must be defined' })
	@IsString({ message: 'Trab.departamento should be a string' })
	departamento: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.catComp must be defined' })
	@IsString({ message: 'Trab.catComp should be a string' })
	catComp: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Trab.catContr must be defined' })
	@IsString({ message: 'Trab.catContr should be a string' })
	catContr: string;

	@ApiProperty()
	@Expose()
	// @IsBoolean({ message: 'Trab.deleteable must be a boolean' })
	deleteable: boolean;
}
