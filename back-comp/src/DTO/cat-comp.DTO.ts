import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ICatCompWithNoModelsDTO, ICCompAddDTO, ICCompCContrDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { CContrAddDTO, CContrGetDTO } from './index';

/**
 * Base class for competence category DTO
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

/**
 *
 * DTO used for adding a new competence category
 *
 */
export class CCompAddDTO extends CCompBaseDTO implements ICCompAddDTO {
	// ?? is catContr required when a cComp is added?
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
 *  Base competence category DTO
 */
export class CCompDTO extends CCompBaseDTO implements ICCompDTO {}

/**
 *  Data of a competence category with the number of evaluation models associated with it, counting with the reference model
 */
export class CatCompWithNoModelsDTO extends CCompBaseDTO implements ICatCompWithNoModelsDTO {
	@ApiProperty()
	@IsInt({ message: 'CatCOmpWithNoModelsDTO.nModels must be an integer' })
	nModels: number;
}
