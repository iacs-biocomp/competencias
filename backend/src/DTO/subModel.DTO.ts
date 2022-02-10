import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ISubModelGetDTO } from 'sharedInterfaces/DTO';
import { CompGetDTO, ComportGetDTO, NivelGetDTO } from './index';

export class SubModelDTO implements ISubModelGetDTO {
	@ApiProperty()
	@Expose()
	id: number;

	@ApiProperty({ type: () => NivelGetDTO })
	@Type(() => NivelGetDTO)
	@Expose()
	nivel: NivelGetDTO;

	@ApiProperty({ type: () => CompGetDTO })
	@Type(() => CompGetDTO)
	@Expose()
	competencia: CompGetDTO;

	@ApiProperty({ type: () => ComportGetDTO })
	@Type(() => ComportGetDTO)
	@Expose()
	comportamientos: ComportGetDTO[];

	@ApiProperty()
	@Expose()
	nivelDescription?: string;
}
