import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IComportAddDTO, IComportGetDTO, IComportPutDTO } from 'sharedInterfaces/DTO';

abstract class ComportBaseDTO implements IComportGetDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Comport.id must be defined' })
	@IsString({ message: 'Comport.id must be a string' })
	id!: string;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Comport.id must be defined' })
	@IsString({ message: 'Comport.descripcion must be a string' })
	descripcion!: string;
}

/**
 * TODO: tsdoc in english
 * @author aml360 <aml360esp@gmail.com>
 */
export class ComportGetDTO extends ComportBaseDTO implements IComportGetDTO {}

/**
 * TODO: tsdoc in english
 * @author aml360 <aml360esp@gmail.com>
 */
export class ComportAddDTO extends ComportBaseDTO implements IComportAddDTO {}

export class ComportPutDTO extends ComportBaseDTO implements IComportPutDTO {}
