import { ApiProperty } from '@nestjs/swagger';
import { IEvModel } from 'sharedInterfaces/Entity';
import {
	Entity,
	BaseEntity,
	OneToMany,
	PrimaryGeneratedColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
	Column,
} from 'typeorm';
import { CatComp, Ev, SubModel } from './index';

@Entity()
export class EvModel extends BaseEntity implements IEvModel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Ev })
	@OneToMany(() => Ev, ev => ev.model, { nullable: true })
	evs?: Ev[];

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(() => CatComp, cat => cat.models, { nullable: false })
	catComp: CatComp;

	@ApiProperty({ type: () => SubModel })
	@ManyToMany(() => SubModel, subModel => subModel.modelos)
	@JoinTable()
	subModels: SubModel[];

	/**
	 * Representa si el modelo es de referencia para esa categoría competencial, si es `true`, el modelo no se podrá asociar a ninguna evaluacion
	 */
	@Column({ default: false, nullable: false })
	reference: boolean;
}
