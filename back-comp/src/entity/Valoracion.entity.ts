import { ApiProperty } from '@nestjs/swagger';
import { IValoracion, ValoracionesNums } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Competencia, Comportamiento, Ev, Trabajador } from './index';

@Entity()
export class Valoracion extends BaseEntity implements IValoracion {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@ManyToOne(() => Trabajador, { nullable: false })
	@JoinColumn()
	evaluador: Trabajador;

	@ApiProperty({ type: () => Trabajador })
	@ManyToOne(() => Trabajador, { nullable: false })
	@JoinColumn()
	evaluado: Trabajador;

	@ApiProperty({ type: () => Ev })
	@ManyToOne(() => Ev, ev => ev.valoraciones, { nullable: false })
	@JoinColumn()
	ev: Ev;

	/** La competencia que junto con el comportamiento hacen la valoracion */
	@ApiProperty({ type: () => Competencia })
	@ManyToOne(() => Competencia, { nullable: false })
	@JoinColumn()
	comp: Competencia;

	/** El comportamiento valorado */
	@ApiProperty({ type: () => Comportamiento })
	@ManyToOne(() => Comportamiento, { nullable: false })
	@JoinColumn()
	comport: Comportamiento;

	@ApiProperty({})
	@Column({ type: 'int2', nullable: false, enum: [1, 2, 3, 4, 5] })
	valoracion: ValoracionesNums;
}
