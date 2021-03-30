import { Entity, BaseEntity, OneToMany, PrimaryColumn, Column } from 'typeorm';
import { SubModel } from './SubModel.entity';

@Entity()
export class Competencia extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({ type: 'varchar', nullable: false })
	descripcion: string;

	@OneToMany((type) => SubModel, (subm) => subm.nivel)
	subModels: SubModel[];

	// TODO: Elegir un nombre correcto
}
