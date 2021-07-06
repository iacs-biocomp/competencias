import { ApiProperty } from '@nestjs/swagger';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { SubModel } from './index';

@Entity()
export class Comportamiento extends BaseEntity implements IComportamiento {
	@ApiProperty()
	@PrimaryColumn()
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@ApiProperty({ type: () => SubModel })
	@ManyToMany(type => SubModel, subm => subm.comportamientos)
	subModels?: SubModel[];
}
