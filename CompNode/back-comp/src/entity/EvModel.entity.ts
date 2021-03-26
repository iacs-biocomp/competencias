import {
	Entity,
	Column,
	BaseEntity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Ev } from './Ev.entity';

@Entity()
export class EvModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@OneToMany((type) => Ev, (ev) => ev.model)
	evs: Ev[];
}
