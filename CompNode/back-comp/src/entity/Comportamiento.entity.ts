import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { SubModel } from '.';

@Entity()
export class Comportamiento extends BaseEntity {
	@ApiProperty()
	@PrimaryColumn()
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@ApiProperty({ type: () => SubModel })
	@ManyToMany(type => SubModel, subm => subm.comportamientos)
	subModels: SubModel[];
}
