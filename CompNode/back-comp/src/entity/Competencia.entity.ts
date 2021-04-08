import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, OneToMany, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { SubModel } from './SubModel.entity';

@Entity()
export class Competencia extends BaseEntity {
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
