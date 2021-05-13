import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Competencia, Comportamiento, EvModel, Nivel } from '.';

@Entity()
// TODO: Elegir un nombre correcto
export class SubModel extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => EvModel })
	@ManyToMany(type => EvModel, model => model.subModels)
	modelos: EvModel[];

	@ApiProperty({ type: () => Nivel })
	@ManyToOne(type => Nivel, n => n.subModels)
	nivel: Nivel;

	@ApiProperty()
	@ManyToOne(type => Competencia, comp => comp.subModels)
	competencia: Competencia;

	@ApiProperty()
	@ManyToMany(type => Comportamiento, comport => comport.subModels)
	@JoinTable()
	comportamientos: Comportamiento[];
}
