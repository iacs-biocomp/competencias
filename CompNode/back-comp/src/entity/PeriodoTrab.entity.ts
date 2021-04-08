import { ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@ManyToOne(type => Trabajador, trabajador => trabajador.periodos)
	trabajador: Trabajador;

	@ApiProperty({ type: () => CatContr })
	@ManyToOne(type => CatContr, catContr => catContr.periodos)
	catContr: CatContr;

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp, cComp => cComp.periodosTrab)
	catComp: CatComp;

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(type => Trabajador, sup => sup)
	@JoinTable()
	superiores: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(type => Trabajador, par => par)
	@JoinTable()
	pares: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(type => Trabajador, inf => inf)
	@JoinTable()
	inferiores: Trabajador[];

	@ApiProperty()
	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@ApiProperty()
	@Column({ type: 'timestamp', nullable: true })
	endAt: Date;
}
