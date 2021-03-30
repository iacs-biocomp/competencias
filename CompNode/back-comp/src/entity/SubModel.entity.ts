import {
	Entity,
	BaseEntity,
	ManyToOne,
	ManyToMany,
	PrimaryGeneratedColumn,
	JoinTable,
} from 'typeorm';
import { Competencia } from './Competencia.entity';
import { Comportamiento } from './Comportamiento.entity';
import { EvModel } from './EvModel.entity';
import { Nivel } from './Nivel.entity';

@Entity()
// TODO: Elegir un nombre correcto
export class SubModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany((type) => EvModel, (model) => model.subModels)
	modelos: EvModel[];

	@ManyToOne((type) => Nivel, (n) => n.subModels)
	nivel: Nivel;

	@ManyToOne((type) => Competencia, (comp) => comp.subModels)
	competencia: Competencia;

	@ManyToMany((type) => Comportamiento, (comport) => comport.subModels)
	@JoinTable()
	comportamientos: Comportamiento[];
}
