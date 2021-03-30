import { Entity, BaseEntity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { SubModel } from './SubModel.entity';

@Entity()
export class Comportamiento extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@ManyToMany((type) => SubModel, (subm) => subm.comportamientos)
	subModels: SubModel[];
}
