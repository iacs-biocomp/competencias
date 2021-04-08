import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { CatComp } from './CatComp.entity';
import { Ev } from './Ev.entity';
import { SubModel } from './SubModel.entity';

@Entity()
export class EvModel extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: string;

	@ApiProperty({ type: () => Ev })
	@OneToMany(type => Ev, ev => ev.model)
	evs: Ev[];

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp, cat => cat.models)
	catComp: CatComp;

	@ApiProperty({ type: () => SubModel })
	@ManyToMany(type => SubModel, subModel => subModel.modelos)
	@JoinTable()
	subModels: SubModel[];
	// TODO: Elegir un nombre correcto
}
