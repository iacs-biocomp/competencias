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
import { CatComp, Ev, SubModel } from '.';

@Entity()
export class EvModel extends BaseEntity implements IEvModel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: string;

	@ApiProperty({ type: () => Ev })
	@OneToMany(type => Ev, ev => ev.model)
	evs?: Ev[];

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp, cat => cat.models)
	catComp: CatComp;

	@ApiProperty({ type: () => SubModel })
	@ManyToMany(type => SubModel, subModel => subModel.modelos)
	@JoinTable()
	subModels: SubModel[];

	/**
	 * Representa si el modelo es de referencia para esa categoría competencial, si es `true`, el modelo no se podrá asociar a ninguna evaluacion
	 */
	@Column({ default: false })
	reference: boolean;
}
