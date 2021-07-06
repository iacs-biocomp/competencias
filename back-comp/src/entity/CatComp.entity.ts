import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, OneToMany, PrimaryColumn } from 'typeorm';
import { PeriodoTrab, EvModel, Ev, CatContr } from './index';
import { ICatComp } from 'sharedInterfaces/Entity';

@Entity()
export class CatComp extends BaseEntity implements ICatComp {
	@ApiProperty()
	@PrimaryColumn('varchar')
	id: string;

	/** La descripción de la categoría competencial */
	@ApiProperty()
	@Column({ type: 'varchar', unique: true, length: 100, nullable: false })
	description: string;

	@ApiProperty({ type: () => CatContr })
	@OneToMany(type => CatContr, catContr => catContr.catComp)
	catContr?: CatContr[];

	/** Los periodos en los que aparece esa categoria competencial, según la petición puede ser undefined */
	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(type => PeriodoTrab, periodoTrab => periodoTrab.catComp)
	periodosTrab?: PeriodoTrab[];

	@ApiProperty({ type: () => EvModel })
	@OneToMany(type => EvModel, model => model.catComp)
	models?: EvModel[];

	@ApiProperty({ type: () => Ev })
	@OneToMany(type => Ev, ev => ev.catComp)
	evaluaciones?: Ev[];
}
