import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { CatComp } from './CatComp.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class CatContr extends BaseEntity {
	@ApiProperty()
	@PrimaryColumn('varchar')
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	description: string;

	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(type => PeriodoTrab, periodo => periodo.catContr)
	periodos: PeriodoTrab[];

	//? Al cambiar la catComp por defecto han de cambiar la catComp de los trabajadores que tengan tambien la de por defecto previa o todos o ninguno
	/**
	 * Es la categoria competencial "por defecto", si cambia se abre un nuevo periodo
	 * para todos los trabajadores que tengan esa contractual y se les asigna
	 * la nueva competencial asignada por defecto
	 */
	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp)
	@JoinColumn()
	catComp: CatComp;
}
