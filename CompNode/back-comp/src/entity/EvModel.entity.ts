import {
	Entity,
	Column,
	BaseEntity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Ev } from './Ev.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity()
export class EvModel extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@OneToMany((type) => Ev, (ev) => ev.model)
	periodosTrab: Ev[];
}
