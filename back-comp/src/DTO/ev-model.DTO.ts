import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsInt } from 'class-validator';
import { IEvModelGetDTO, IEvModelRefUpdateDTO } from 'sharedInterfaces/DTO';
import { IEvaluacion } from 'sharedInterfaces/Entity';
import { CCompDTO, SubModelDTO } from './index';

// TODO: Complete
export class EvModelDTO implements IEvModelGetDTO {
	@ApiProperty()
	@Expose()
	@IsInt({ message: 'EvModel id must be a integer' })
	id!: number;

	@ApiProperty({ type: () => CCompDTO })
	@Expose()
	@Type(() => CCompDTO)
	catComp: CCompDTO;

	// TODO: Complete with dto
	@ApiProperty()
	@Expose()
	// @Type(() => )
	evs: IEvaluacion[];

	// TODO: Complete with dto
	@ApiProperty({ type: [SubModelDTO] })
	@Expose()
	@Type(() => SubModelDTO)
	subModels: SubModelDTO[];

	@ApiProperty()
	@Expose()
	reference: boolean;
}

// export class EvModelAddDTO implements IEvModelAddDTO {}

export class EvModelRefUpdateDTO implements IEvModelRefUpdateDTO {
	@ApiProperty()
	id: number;

	@ApiProperty({ type: () => [CCompDTO] })
	@Type(() => CCompDTO)
	catComp: CCompDTO;

	@ApiProperty({ type: () => [SubModelDTO] })
	@Type(() => SubModelDTO)
	subModels: SubModelDTO[];
}