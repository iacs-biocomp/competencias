import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	CreateDateColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { CatComp } from './CatComp.entity';
import { CatContr } from './CatContr.entity';
import { Trabajador } from './Trabajador.entity';

@Entity('periodo_trab')
export class PeriodoTrab extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => Trabajador, (trabajador) => trabajador.periodos)
	trabajador: Trabajador;

	@ManyToOne((type) => CatContr, (catContr) => catContr.periodos)
	catContr: CatContr;

	@ManyToOne((type) => CatComp, (cComp) => cComp.periodosTrab)
	catComp: CatComp;

	@ManyToMany((type) => Trabajador, (sup) => sup)
	@JoinTable()
	superiores: Trabajador[];

	@ManyToMany((type) => Trabajador, (par) => par)
	@JoinTable()
	pares: Trabajador[];

	@ManyToMany((type) => Trabajador, (inf) => inf)
	@JoinTable()
	inferiores: Trabajador[];

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@Column({ type: 'timestamp', nullable: true })
	endAt: Date;
}
