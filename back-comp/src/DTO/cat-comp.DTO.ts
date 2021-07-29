import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ICatCompWithNoModelsDTO, ICCompAddDTO, ICCompDTO } from 'sharedInterfaces/DTO';
import { CContrAddDTO } from './index';

// TODO: Tsdoc
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

// TODO: Tsdoc
export class CCompCContrDTO extends CCompBaseDTO implements ICCompDTO {}

// TODO: Tsdoc
export class CCompAddDTO extends CCompBaseDTO implements ICCompAddDTO {
	@Expose()
	@ApiProperty({ type: () => CContrAddDTO })
	@Type(() => CContrAddDTO)
	catContr!: CContrAddDTO;
}

// TODO: Tsdoc
export class CCompDTO implements ICCompDTO {
	@Expose()
	@IsNotEmpty({ message: 'Id must not be empty' })
	@IsString({ message: 'Id must be a string' })
	@ApiProperty()
	id!: string;

	@Expose()
	@IsNotEmpty({ message: 'Description must not be empty' })
	@IsString({ message: 'Description must be a string' })
	@ApiProperty()
	description!: string;
}

// TODO: Tsdoc
export class CatCompWithNoModelsDTO extends CCompBaseDTO implements ICatCompWithNoModelsDTO {
	@ApiProperty()
	@IsInt({ message: 'CatCOmpWithNoModelsDTO.nModels must be an integer' })
	nModels: number;
}
