import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { CatComp } from './CatComp.entity';
import { EvModel } from './EvModel.entity';

@Entity()
export class Ev extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: string;

	@ApiProperty()
	@Column({ type: 'varchar', unique: true, length: 25, nullable: false })
	description: string;

	@ApiProperty({ type: () => EvModel })
	@ManyToOne(type => EvModel, model => model.evs)
	model: EvModel;

	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp, cat => cat.evaluaciones)
	catComp: CatComp;
}
