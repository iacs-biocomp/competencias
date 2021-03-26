import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { EvModel } from './EvModel.entity';

@Entity()
export class Ev extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@ManyToOne((type) => EvModel, (model) => model.evs)
	model: EvModel;
}
