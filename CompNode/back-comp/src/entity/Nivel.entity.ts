import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, OneToMany, PrimaryColumn, Column } from 'typeorm';
import { SubModel } from '.';

@Entity()
export class Nivel extends BaseEntity {
	@ApiProperty()
	@PrimaryColumn()
	id: string;

	@ApiProperty()
	@Column({ type: 'float8', unique: true, nullable: false })
	valor: number;

	@ApiProperty({ type: () => SubModel })
	@OneToMany(type => SubModel, subm => subm.nivel)
	subModels: SubModel[];
	// TODO: Elegir un nombre correcto
}
