import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Competencia, Comportamiento, Ev, Trabajador } from '.';

type ValoracionesNums = 1 | 2 | 3 | 4 | 5;

@Entity()
export class Valoracion extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@OneToOne(() => Trabajador)
	@JoinColumn()
	evaluador: Trabajador;

	@ApiProperty({ type: () => Trabajador })
	@OneToOne(() => Trabajador)
	@JoinColumn()
	evaluado: Trabajador;

	@ApiProperty({ type: () => Ev })
	@ManyToOne(type => Ev, ev => ev.valoraciones)
	@JoinColumn()
	ev: Ev;

	/** La competencia que junto con el comportamiento hacen la valoracion */
	@ApiProperty({ type: () => Competencia })
	@ManyToOne(() => Competencia)
	@JoinColumn()
	comp: Competencia;

	/** El comportamiento valorado */
	@ApiProperty({ type: () => Comportamiento })
	@ManyToOne(() => Comportamiento)
	@JoinColumn()
	comport: Comportamiento;

	@ApiProperty({})
	@Column({ type: 'int2', nullable: false })
	valoracion: ValoracionesNums;
}
