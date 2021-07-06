import { ApiProperty } from '@nestjs/swagger';
import { ISubModel } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Competencia, Comportamiento, EvModel, Nivel } from './index';

@Entity()
export class SubModel extends BaseEntity implements ISubModel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => EvModel })
	@ManyToMany(type => EvModel, model => model.subModels)
	modelos: EvModel[];

	@ApiProperty({ type: () => Nivel })
	@ManyToOne(type => Nivel, n => n.subModels, { nullable: false })
	nivel: Nivel;

	@ApiProperty()
	@ManyToOne(type => Competencia, comp => comp.subModels, { nullable: false })
	competencia: Competencia;

	@ApiProperty()
	@ManyToMany(type => Comportamiento, comport => comport.subModels, { nullable: false })
	@JoinTable()
	comportamientos: Comportamiento[];
}
