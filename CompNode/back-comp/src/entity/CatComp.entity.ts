import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, OneToMany, PrimaryColumn, OneToOne } from 'typeorm';
import { CatContr } from './CatContr.entity';
import { Ev } from './Ev.entity';
import { EvModel } from './EvModel.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class CatComp extends BaseEntity {
	@ApiProperty()
	@PrimaryColumn('varchar')
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(type => PeriodoTrab, periodoTrab => periodoTrab.catComp)
	periodosTrab: PeriodoTrab[];

	@ApiProperty({ type: () => EvModel })
	@OneToMany(type => EvModel, model => model.catComp)
	models: EvModel[];

	@ApiProperty({ type: () => Ev })
	@OneToMany(type => Ev, ev => ev.catComp)
	evaluaciones: Ev[];

	@ApiProperty({ type: () => CatContr })
	@OneToOne(type => CatContr)
	catContr: CatContr;
}
