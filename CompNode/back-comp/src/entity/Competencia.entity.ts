import { ApiProperty } from '@nestjs/swagger';
import { ICompetencia } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, OneToMany, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { SubModel } from './index';

@Entity()
export class Competencia extends BaseEntity implements ICompetencia {
	@ApiProperty()
	@PrimaryColumn()
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@ApiProperty()
	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@ApiProperty({ type: () => SubModel })
	@OneToMany(type => SubModel, subm => subm.nivel)
	subModels: SubModel[];
}
