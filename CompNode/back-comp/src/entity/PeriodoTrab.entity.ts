import { ApiProperty } from '@nestjs/swagger';
import { IPeriodoTrab } from 'sharedInterfaces/Entity';
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
import { CatComp, CatContr, Trabajador } from '.';

@Entity('periodo_trab')
export class PeriodoTrab extends BaseEntity implements IPeriodoTrab {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@ManyToOne(type => Trabajador, trabajador => trabajador.periodos, { nullable: false })
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
	superiores?: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(type => Trabajador, par => par)
	@JoinTable()
	pares?: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(type => Trabajador, inf => inf)
	@JoinTable()
	inferiores?: Trabajador[];

	@ApiProperty()
	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@ApiProperty()
	@Column({ type: 'timestamp', nullable: true })
	endAt?: Date;

	@ApiProperty()
	@Column({ type: 'bool', default: false, nullable: false })
	actual: boolean;
}
