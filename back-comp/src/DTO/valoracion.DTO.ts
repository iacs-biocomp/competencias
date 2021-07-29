import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';
import { IValoracionAddDTO } from 'sharedInterfaces/DTO';
import { ValoracionesNums } from 'sharedInterfaces/Entity';
import { Competencia, Comportamiento, Ev, Trabajador } from 'src/entity';

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
	evaluador: Trabajador['dni'];

	@ApiProperty()
	@Expose()
	evaluado: Trabajador['dni'];

	@ApiProperty()
	@Expose()
	ev: Ev['id'];

	@ApiProperty()
	@Expose()
	comp: Competencia['id'];

	@ApiProperty()
	@Expose()
	comport: Comportamiento['id'];

	// TODO: test cast to valoracionesNum
	@ApiProperty()
	@Expose()
	@IsIn([1, 2, 3, 4, 5], { message: 'The valoration must be a integer between 1 and 5' })
	valoracion: ValoracionesNums;
}

// export class ValoracionDTO implements IValoracionToAddDTO {}
