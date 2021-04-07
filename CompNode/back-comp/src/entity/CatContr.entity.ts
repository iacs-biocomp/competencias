import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class CatContr extends BaseEntity {
	@PrimaryColumn('varchar')
	id: string;

	@Column({ type: 'varchar', nullable: false })
	description: string;

	@OneToMany(type => PeriodoTrab, periodo => periodo.catContr)
	periodos: PeriodoTrab[];
}
