import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsInt } from 'class-validator';
import { IValoracionAddDTO, IValoracionUpdateDTO } from 'sharedInterfaces/DTO';
import { ValoracionesNums } from 'sharedInterfaces/Entity';

// TODO: Compelte
/* export class ValoracionBaseDTO implements IValoracionAddDTO {
	@ApiProperty()
	@Expose()
	evaluador: ITrabajador;

	@ApiProperty()
	@Expose()
	@Type(() => ComportGetDTO)
	evaluado: ITrabajador;

	@ApiProperty()
	@Expose()
	@Type(() => ComportGetDTO)
	ev: IEvaluacion;

	@ApiProperty()
	@Expose()
	@Type(() => CompGetDTO)
	comp: CompGetDTO;

	@ApiProperty()
	@Expose()
	@Type(() => ComportGetDTO)
	comport: ComportGetDTO;

	@ApiProperty()
	@Expose()
	@IsIn([1, 2, 3, 4, 5], { message: 'The valoration must be a integer between 1 and 5' })
	valoracion: ValoracionesNums;
} */

export class ValoracionAddDTO implements IValoracionAddDTO {
	@ApiProperty()
	@Expose()
	evaluador: string;

	@ApiProperty()
	@Expose()
	evaluado: string;

	@ApiProperty()
	@Expose()
	ev: number;

	@ApiProperty()
	@Expose()
	comp: string;

	@ApiProperty()
	@Expose()
	comport: string;

	// TODO: test cast to valoracionesNum
	@ApiProperty()
	@Expose()
	@IsInt()
	@IsIn([1, 2, 3, 4, 5], { message: 'The valoration must be a integer between 1 and 5' })
	valoracion: ValoracionesNums;
}

export class ValoracionUpdateDTO implements IValoracionUpdateDTO {
	@ApiProperty()
	@Expose()
	@IsInt({ message: 'Val.id must be a integer' })
	id: number;

	@ApiProperty()
	@Expose()
	evaluador: string;

	@ApiProperty()
	@Expose()
	evaluado: string;

	@ApiProperty()
	@Expose()
	ev: number;

	@ApiProperty()
	@Expose()
	comp: string;

	@ApiProperty()
	@Expose()
	comport: string;

	// TODO: test cast to valoracionesNum
	@ApiProperty()
	@Expose()
	@IsInt()
	@IsIn([1, 2, 3, 4, 5], { message: 'The valoration must be a integer between 1 and 5' })
	valoracion: ValoracionesNums;
}

// export class ValoracionDTO implements IValoracionToAddDTO {}
