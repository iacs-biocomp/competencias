import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IEvSendDTO, IUpdateEvShowingResultsDTO } from 'sharedInterfaces/DTO';
import { EvModelDTO, CCompDTO } from './index';

//TODO: Tsdoc, why is an abstract class, etc
abstract class EvAddBaseDTO implements IEvSendDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'Ev description must not be undefined or null' })
	@IsString({ message: 'Ev description must be a string' })
	description!: string;

	@ApiProperty({ type: () => EvModelDTO })
	@Expose()
	model: EvModelDTO;

	@ApiProperty({ type: () => CCompDTO })
	@Expose()
	catComp: CCompDTO;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.iniDate must be a date' })
	iniDate: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.finPropuestas must be a date' })
	finPropuestas: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd. must be a date' })
	iniValidacion: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd. must be a date' })
	endValidacion: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.iniValoracion must be a date' })
	iniValoracion: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.endValoracion must be a date' })
	endValoracion: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.iniPerEvaluado must be a date' })
	iniPerEvaluado: Date;

	@ApiProperty()
	@Expose()
	@IsDate({ message: 'EvAdd.endPerEvaluado must be a date' })
	endPerEvaluado: Date;
}

export class EvAddDTO extends EvAddBaseDTO {}

export class EvUpdateDTO extends EvAddBaseDTO implements IEvSendDTO {
	@ApiProperty()
	@Expose()
	@IsBoolean({ message: 'EvUpdateDTO.isShowingResults must be a boolean' })
	isShowingResults: boolean;
}

export class UpdateEvShowingResultsDTO implements IUpdateEvShowingResultsDTO {
	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'UpdateEvShowingResultsDTO.id must be defined' })
	@IsInt({ message: 'UpdateEvShowingResultsDTO.id must be a integer' })
	id: number;

	@ApiProperty()
	@Expose()
	@IsNotEmpty({ message: 'UpdateEvShowingResultsDTO.isShowingResults must be defined' })
	@IsBoolean({ message: 'UpdateEvShowingResultsDTO.isShowingResults must be a boolean' })
	isShowingResults: boolean;
}

export class EvDTO extends EvAddBaseDTO implements IEvSendDTO {
	@ApiProperty()
	@Expose()
	@IsBoolean({ message: 'EvUpdateDTO.isShowingResults must be a boolean' })
	isShowingResults: boolean;
}
