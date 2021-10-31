import { ApiProperty } from '@nestjs/swagger';
import { ICatContr } from 'sharedInterfaces/Entity';
import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { CatComp, PeriodoTrab } from './index';

@Entity()
export class CatContr extends BaseEntity implements ICatContr {
	@ApiProperty()
	@PrimaryColumn('varchar')
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	description: string;

	//? Al cambiar la catComp por defecto han de cambiar la catComp de los trabajadores que tengan tambien la de por defecto previa o todos o ninguno
	/**
	 * Es la categoria competencial "por defecto", si cambia se abre un nuevo periodo
	 * para todos los trabajadores que tengan esa contractual y se les asigna
	 * la nueva competencial asignada por defecto
	 */
	@ApiProperty({ type: () => CatComp })
	@ManyToOne(() => CatComp /* { nullable: false (true?) } */)
	@JoinColumn()
	catComp?: CatComp;

	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(() => PeriodoTrab, periodo => periodo.catContr)
	periodos?: PeriodoTrab[];
}
