import { Entity, Column, BaseEntity, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Ev } from './Ev.entity';
import { Trabajador } from './Trabajador.entity';

@Entity()
export class Valoracion extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(type => Trabajador)
	@JoinColumn()
	evaluador: Trabajador;

	@OneToOne(type => Trabajador)
	@JoinColumn()
	evaluado: Trabajador;

	@OneToOne(type => Ev)
	@JoinColumn()
	ev: Ev;
	// Añadir competencia nivel y comportamiento junto con la valoración en si

	// @OneToOne((type) => Trabajador)
	// @JoinColumn()
}
