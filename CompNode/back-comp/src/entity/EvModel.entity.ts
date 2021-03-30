import {
	Entity,
	BaseEntity,
	OneToMany,
	PrimaryGeneratedColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { CatComp } from './CatComp.entity';
import { Ev } from './Ev.entity';
import { SubModel } from './SubModel.entity';

@Entity()
export class EvModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@OneToMany((type) => Ev, (ev) => ev.model)
	evs: Ev[];

	@ManyToOne((type) => CatComp, (cat) => cat.models)
	catComp: CatComp;

	@ManyToMany((type) => SubModel, (subModel) => subModel.modelos)
	@JoinTable()
	subModels: SubModel[];
	// TODO: Elegir un nombre correcto
}
