import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { CatComp } from './CatComp.entity';
import { CatContr } from './CatContr.entity';
import { Trabajador } from './Trabajador.entity';

@Entity('periodo_trab')
export class PeriodoTrab extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	age: number;

	@ManyToOne((type) => Trabajador, (trabajador) => trabajador.periodos)
	trabajador: Trabajador;

	@ManyToOne((type) => CatContr, (catContr) => catContr.periodos)
	catContr: CatContr;

	@ManyToOne((type) => CatComp, (cComp) => cComp.periodosTrab)
	catComp: CatComp;

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;
}
