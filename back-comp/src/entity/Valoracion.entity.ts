import { ApiProperty } from '@nestjs/swagger';
import { IValoracion, ValoracionesNums } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Competencia, Comportamiento, Ev, Trabajador } from './index';
import { Nivel } from './Nivel.entity';

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

	@ApiProperty({ type: () => Nivel })
	@ManyToOne(() => Nivel, { nullable: false })
	@JoinColumn()
	nivel: Nivel;
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

	static isValWithComport(val: Valoracion): val is ValWithComport {
		return typeof val === 'object' && !!val.comport;
	}
	static isValWithComp(val: Valoracion): val is ValWithComp {
		return typeof val === 'object' && !!val.comp;
	}
	static isValWithEv(val: Valoracion): val is ValWithEv {
		return typeof val === 'object' && !!val.ev;
	}
	static isValWithEvaluador(val: Valoracion): val is ValWithEvaluador {
		return typeof val === 'object' && !!val.evaluador;
	}
	static isValWithEvaluado(val: Valoracion): val is ValWithEvaluado {
		return typeof val === 'object' && !!val.evaluado;
	}
}

export function isValWithComport(val: Valoracion): val is ValWithComport {
	return !!val.evaluado;
}

interface ValWithComport extends Valoracion {
	comport: NonNullable<Valoracion['comport']>;
}
interface ValWithComp extends Valoracion {
	comp: NonNullable<Valoracion['comp']>;
}
interface ValWithEv extends Valoracion {
	ev: NonNullable<Valoracion['ev']>;
}
interface ValWithEvaluador extends Valoracion {
	evaluador: NonNullable<Valoracion['evaluador']>;
}
interface ValWithEvaluado extends Valoracion {
	evaluado: NonNullable<Valoracion['evaluado']>;
}
