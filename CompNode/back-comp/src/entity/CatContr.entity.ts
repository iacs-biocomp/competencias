import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
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
}
