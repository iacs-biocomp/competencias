import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ITrabAddDTO } from 'sharedInterfaces/DTO';

export abstract class TrabBase {
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
	// @IsNotEmpty({ message: 'Trab.departamento must be defined' })
	@IsString({ message: 'Trab.departamento should be a string' })
	departamento: string;

	@ApiProperty()
	@Expose()
	// @IsBoolean({ message: 'Trab.deleteable must be a boolean' })
	deleteable: boolean;
}

export class TrabCCompCContrDTO extends TrabBase {}
export class TrabAddDTO extends TrabBase implements ITrabAddDTO {
	catComp: string;
	catContr: string;
}
