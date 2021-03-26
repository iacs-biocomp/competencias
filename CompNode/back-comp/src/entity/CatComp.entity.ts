import { Entity, Column, BaseEntity, OneToMany, PrimaryColumn } from 'typeorm';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class CatComp extends BaseEntity {
	@PrimaryColumn('varchar')
	id: string;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@OneToMany((type) => PeriodoTrab, (periodoTrab) => periodoTrab.catComp)
	periodosTrab: PeriodoTrab[];
}
