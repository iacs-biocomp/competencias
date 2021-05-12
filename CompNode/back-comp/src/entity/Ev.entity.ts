import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { CatComp } from './CatComp.entity';
import { EvModel } from './EvModel.entity';
import { Valoracion } from './Valoracion.entity';

@Entity()
export class Ev extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: string;

	//? Nullable?
	@ApiProperty()
	@Column({ type: 'varchar', length: 35, nullable: true })
	description: string;

	/**
	 * El modelo representa el COMO se realiza la evaluación, es decir las competencias niveles y comportamientos que tiene la evaluacion y como se relacionan entre ellos
	 */
	@ApiProperty({ type: () => EvModel })
	@ManyToOne(type => EvModel, model => model.evs)
	model: EvModel;

	/**
	 * Es la categoria competencial sobre la que se lanza la evaluacion, ha de coincidir con la del modelo que use la evaluación
	 */
	@ApiProperty({ type: () => CatComp })
	@ManyToOne(type => CatComp, cat => cat.evaluaciones)
	catComp: CatComp;

	/**
	 * Representa el inicio del periodo para proponer evaluadores, debe ser la MENOR de todas las fechas (Sin contar el periodo evaluado)
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	iniDate: Date;

	/**
	 * Representa el final del periodo para proponer evaluadores
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	finPropuestas: Date;

	/**
	 * Representa el inicio del periodo para validar los evaluadores propuestos por los evaluados
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	iniValidacion: Date;

	/**
	 * Representa el final del periodo para validar los evaluadores propuestos por los evaluados
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	endValidacion: Date;

	/**
	 * Representa el inicio del periodo para valorar a los evaluados
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	iniValoracion: Date;

	/**
	 * Representa el final del periodo para valorar a los evaluados
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	endValoracion: Date;

	/**
	 * Representa el inicio del periodo evaluado
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	iniPerEvaluado: Date;

	/**
	 * Representa el final del periodo evaluado
	 */
	@ApiProperty()
	@Column({ type: 'timestamp', nullable: false })
	endPerEvaluado: Date;

	/**
	 * Son todas las valoraciones que se asocian a esa evaluacion
	 */
	@ApiProperty()
	@OneToMany(type => Valoracion, v => v.ev)
	valoraciones?: Valoracion[];
}
