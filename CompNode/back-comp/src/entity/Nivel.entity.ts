import { Entity, BaseEntity, OneToMany, PrimaryColumn, Column } from 'typeorm';
import { SubModel } from './SubModel.entity';

@Entity()
export class Nivel extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({ type: 'float8', unique: true, nullable: false })
	valor: number;

	@OneToMany(type => SubModel, subm => subm.nivel)
	subModels: SubModel[];
	// TODO: Elegir un nombre correcto
}
