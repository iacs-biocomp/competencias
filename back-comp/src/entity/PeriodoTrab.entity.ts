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
import { CatComp, CatContr, Trabajador } from './index';

@Entity('periodo_trab')
export class PeriodoTrab extends BaseEntity implements IPeriodoTrab {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@ManyToOne(() => Trabajador, trabajador => trabajador.periodos, { nullable: false })
	trabajador: Trabajador;

	@ApiProperty({ type: () => CatContr })
	@ManyToOne(() => CatContr, catContr => catContr.periodos)
	catContr: CatContr;
	// ! Confirmar con vega si un periodo puede tener catContr null

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(() => CatComp, cComp => cComp.periodosTrab, { nullable: false })
	catComp: CatComp;
	// ! Confirmar con vega si un periodo puede tener catComp null

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(() => Trabajador, sup => sup)
	@JoinTable()
	superiores?: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(() => Trabajador, par => par)
	@JoinTable()
	pares?: Trabajador[];

	@ApiProperty({ type: () => Trabajador })
	@ManyToMany(() => Trabajador, inf => inf)
	@JoinTable()
	inferiores?: Trabajador[];

	@ApiProperty()
	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt: Date;

	@ApiProperty()
	@Column({ type: 'timestamp', nullable: true })
	endAt?: Date;
	//?? Better if it's null instead optional?

	@ApiProperty()
	@Column({ type: 'bool', default: false, nullable: false })
	actual: boolean;
}
