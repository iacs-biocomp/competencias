import {
	Entity,
	BaseEntity,
	OneToMany,
	PrimaryGeneratedColumn,
	ManyToOne,
} from 'typeorm';
import { CatComp } from './CatComp.entity';
import { Ev } from './Ev.entity';

@Entity()
export class EvModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@OneToMany((type) => Ev, (ev) => ev.model)
	evs: Ev[];

	@ManyToOne((type) => CatComp, (cat) => cat.models)
	catComp: CatComp;
}
