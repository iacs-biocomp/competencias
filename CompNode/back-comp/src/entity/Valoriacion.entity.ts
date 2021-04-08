import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Ev } from './Ev.entity';
import { Trabajador } from './Trabajador.entity';

@Entity()
export class Valoracion extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Trabajador })
	@OneToOne(type => Trabajador)
	@JoinColumn()
	evaluador: Trabajador;

	@ApiProperty({ type: () => Trabajador })
	@OneToOne(type => Trabajador)
	@JoinColumn()
	evaluado: Trabajador;

	@ApiProperty({ type: () => Ev })
	@OneToOne(type => Ev)
	@JoinColumn()
	ev: Ev;

	// Añadir competencia nivel y comportamiento junto con la valoración en si

	// @OneToOne((type) => Trabajador)
	// @JoinColumn()
}
