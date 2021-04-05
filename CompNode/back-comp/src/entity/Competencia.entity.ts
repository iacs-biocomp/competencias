import {
	Entity,
	BaseEntity,
	OneToMany,
	PrimaryColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';
import { SubModel } from './SubModel.entity';

@Entity()
export class Competencia extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@OneToMany((type) => SubModel, (subm) => subm.nivel)
	subModels: SubModel[];
}
