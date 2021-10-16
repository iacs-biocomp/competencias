import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { IEvModelAddDTO, IEvModelGetDTO, IEvModelRefUpdateDTO, ISubModelAddDTO } from 'sharedInterfaces/DTO';
import { CCompDTO, CompGetDTO, ComportGetDTO, NivelGetDTO, SubModelDTO } from './index';

export class EvModelDTO implements IEvModelGetDTO {
	@ApiProperty()
	@Expose()
	@IsInt({ message: 'EvModel id must be a integer' })
	id!: number;

	@ApiProperty({ type: () => CCompDTO })
	@Expose()
	@Type(() => CCompDTO)
	catComp: CCompDTO;

	@ApiProperty({ type: [SubModelDTO] })
	@Expose()
	@Type(() => SubModelDTO)
	subModels: SubModelDTO[];

	@ApiProperty()
	@Expose()
	reference: boolean;
}

// TODO: Test this class, if works properly, export and use in endpoints
class EvModelAddDTO implements IEvModelAddDTO {
	@ApiProperty({ type: () => [CCompDTO] })
	@Expose()
	@Type(() => CompGetDTO)
	catComp: CCompDTO;

	@ApiProperty({ type: () => [SubModelAddDTO] })
	@Expose()
	@Type(() => CompGetDTO)
	subModels: ISubModelAddDTO[];

	@ApiProperty()
	@Expose()
	reference: boolean;
}

export class EvModelRefUpdateDTO implements IEvModelRefUpdateDTO {
	@ApiProperty()
	@Expose()
	id: number;

	@ApiProperty({ type: () => [CCompDTO] })
	@Expose()
	@Type(() => CCompDTO)
	catComp: CCompDTO;

	@ApiProperty({ type: () => [SubModelDTO] })
	@Expose()
	@Type(() => SubModelDTO)
	subModels: SubModelDTO[];
}

// TODO: Test this class, if works properly, export and use in endpoints
class SubModelAddDTO implements ISubModelAddDTO {
	// TODO: Isnt necessary to send a full level, only identifier is necessary, refactor
	@ApiProperty({ type: () => [NivelGetDTO] })
	@Expose()
	@Type(() => NivelGetDTO)
	nivel: NivelGetDTO;

	// TODO: Isnt necessary to send a full competence, only identifier is necessary, refactor
	@ApiProperty({ type: () => [CompGetDTO] })
	@Expose()
	@Type(() => CompGetDTO)
	competencia: CompGetDTO;

	// TODO: Isnt necessary to send an array of behaviours, only identifiers are necessary, refactor
	@ApiProperty({ type: () => [ComportGetDTO] })
	@Expose()
	@Type(() => ComportGetDTO)
	comportamientos: ComportGetDTO[];

	@ApiProperty()
	@Expose()
	nivelDescription?: string;
}
