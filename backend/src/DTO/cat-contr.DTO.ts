import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ICContrAddDTO, ICContrAndCCompDTO, ICContrBase, ICContrGetDTO } from 'sharedInterfaces/DTO';
import { CCompDTO } from './index';

export class CContrBase implements ICContrBase {
	@Expose()
	@ApiProperty()
	@IsNotEmpty({ message: 'ID cannot be undefined | null' })
	@IsString({ message: 'CContr.ID must be a string' })
	id!: string;

	@Expose()
	@ApiProperty()
	@IsNotEmpty({ message: 'Undefined | null description, must be defined' })
	@IsString({ message: 'Description must be a string' })
	description!: string;
}

export class CContrAddDTO extends CContrBase implements ICContrAddDTO {}

export class CContrGetDTO extends CContrBase implements ICContrGetDTO {}

export class CContrAndCCompDTO extends CContrAddDTO implements ICContrAndCCompDTO {
	@Expose()
	@ApiProperty({ type: () => CCompDTO })
	@Type(() => CCompDTO)
	catComp!: CCompDTO;
}
