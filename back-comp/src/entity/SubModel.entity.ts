import { ApiProperty } from '@nestjs/swagger';
import { ISubModel } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, Column } from 'typeorm';
import { Competencia, Comportamiento, EvModel, Nivel } from './index';

@Entity()
export class SubModel extends BaseEntity implements ISubModel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => EvModel })
	@ManyToMany(() => EvModel, model => model.subModels)
	modelos: EvModel[];

	@ApiProperty({ type: () => Nivel })
	@ManyToOne(() => Nivel, n => n.subModels, { nullable: false })
	nivel: Nivel;

	@ApiProperty()
	@Column({ type: 'varchar', length: 120, default: '', nullable: true })
	nivelDescription?: string;

	@ApiProperty({ type: () => Competencia })
	@ManyToOne(() => Competencia, comp => comp.subModels, { nullable: false })
	competencia: Competencia;

	@ApiProperty({ type: () => Comportamiento })
	@ManyToMany(() => Comportamiento, comport => comport.subModels, { nullable: false })
	@JoinTable()
	comportamientos: Comportamiento[];
}
