import {
	Entity,
	Column,
	BaseEntity,
	OneToMany,
	PrimaryColumn,
	ManyToOne,
} from 'typeorm';
import { EvModel } from './EvModel.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class CatComp extends BaseEntity {
	@PrimaryColumn('varchar')
	id: string;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@OneToMany((type) => PeriodoTrab, (periodoTrab) => periodoTrab.catComp)
	periodosTrab: PeriodoTrab[];

	@ManyToOne((type) => EvModel, (model) => model.catComp)
	models: EvModel[];
}
