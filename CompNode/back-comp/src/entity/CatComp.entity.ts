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

	/** La descripción de la categoría competencial */
	@ApiProperty()
	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	/** Los periodos en los que aparece esa categoria competencial, según la petición puede ser undefined */
	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(type => PeriodoTrab, periodoTrab => periodoTrab.catComp)
	periodosTrab: PeriodoTrab[] | undefined;

	@ApiProperty({ type: () => EvModel })
	@OneToMany(type => EvModel, model => model.catComp)
	models: EvModel[];

	@ApiProperty({ type: () => Ev })
	@OneToMany(type => Ev, ev => ev.catComp)
	evaluaciones: Ev[];

	@ApiProperty({ type: () => CatContr })
	@OneToMany(type => CatContr, catContr => catContr.catComp)
	catContr: CatContr;
}
