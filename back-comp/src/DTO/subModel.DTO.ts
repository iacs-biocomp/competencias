import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ISubModelGetDTO } from 'sharedInterfaces/DTO';
import { CompGetDTO, ComportGetDTO, NivelGetDTO } from './index';

export class SubModelDTO implements ISubModelGetDTO {
	@ApiProperty()
	id: number;

	@ApiProperty({ type: () => NivelGetDTO })
	@Type(() => NivelGetDTO)
	nivel: NivelGetDTO;

	@ApiProperty({ type: () => CompGetDTO })
	@Type(() => CompGetDTO)
	competencia: CompGetDTO;

	@ApiProperty({ type: () => ComportGetDTO })
	@Type(() => ComportGetDTO)
	comportamientos: ComportGetDTO[];

	@ApiProperty()
	nivelDescription?: string;
}
