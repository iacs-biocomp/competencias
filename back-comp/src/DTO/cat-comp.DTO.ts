import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ICatCompWithNoModelsDTO, ICCompAddDTO, ICCompCContrDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { CContrAddDTO, CContrGetDTO } from './index';

// TODO: Translate TSDoc to English

/**
 * DTO base del cual el resto heredan
 */
abstract class CCompBaseDTO implements ICCompDTO {
	@Expose()
	@IsNotEmpty({ message: 'CCompBaseDTO.Id must not be empty' })
	@IsString({ message: 'CCompBaseDTO.Id must be a string' })
	@ApiProperty()
	id!: string;

	@Expose()
	@IsNotEmpty({ message: 'CCompBaseDTO.Description must not be empty' })
	@IsString({ message: 'CCompBaseDTO.Description must be a string' })
	@ApiProperty()
	description!: string;
}

// TODO: catContr required?
/**
 *
 * DTO usado para añadir una nueva categoría competencial
 */
export class CCompAddDTO extends CCompBaseDTO implements ICCompAddDTO {
	@Expose()
	@ApiProperty({ type: () => CContrAddDTO })
	@Type(() => CContrAddDTO)
	catContr!: CContrAddDTO;
}

export class CCompCContrDTO extends CCompBaseDTO implements ICCompCContrDTO {
	@Expose()
	@ApiProperty({ type: () => CContrGetDTO })
	@Type(() => CContrGetDTO)
	catContr!: CContrGetDTO[];
}

/**
 *  Categoría competencial base
 */
export class CCompDTO extends CCompBaseDTO implements ICCompDTO {}

/**
 *  Categoría competencial con numero de modelos asociados, contando el de referencia
 */
export class CatCompWithNoModelsDTO extends CCompBaseDTO implements ICatCompWithNoModelsDTO {
	@ApiProperty()
	@IsInt({ message: 'CatCOmpWithNoModelsDTO.nModels must be an integer' })
	nModels: number;
}
