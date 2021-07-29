import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ICContrAddDTO, ICContrAndCCompDTO } from 'sharedInterfaces/DTO';
import { CCompDTO } from './index';

//TODO: Tsdoc, similar as CompAddDTO
export class CContrAddDTO implements ICContrAddDTO {
	@Expose()
	@ApiProperty()
	@IsNotEmpty({ message: 'ID cannot be undefined | null' })
	id!: string;

	@Expose()
	@ApiProperty()
	@IsNotEmpty({ message: 'Undefined | null description, needs to be defined' })
	@IsString({ message: 'Description needs to be a string' })
	description!: string;
}

// TODO: implement DTO interface and export in sharedCode
export class CContrAndCCompDTO extends CContrAddDTO implements ICContrAndCCompDTO {
	@Expose()
	@ApiProperty({ type: () => CCompDTO })
	@Type(() => CCompDTO)
	catComp!: CCompDTO;
}
