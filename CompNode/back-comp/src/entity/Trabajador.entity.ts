import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('trabajador')
export class Trabajador extends BaseEntity {
	@ApiProperty()
	@PrimaryColumn('varchar')
	dni: string;

	@ApiProperty()
	@Column({ type: 'varchar', length: 20, nullable: false })
	nombre: string;

	@ApiProperty()
	@Column({ type: 'varchar', length: 50, nullable: false })
	apellidos: string;

	@ApiProperty()
	@Column({ type: 'varchar', length: 50, nullable: false })
	area: string;

	@ApiProperty()
	@Column({ type: 'varchar', length: 50, nullable: false })
	unidad: string;

	@ApiProperty()
	@Column({ type: 'varchar', length: 50, nullable: true })
	departamento: string;

	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(type => PeriodoTrab, periodoTrab => periodoTrab.trabajador, { nullable: false })
	periodos: PeriodoTrab[];

	@ApiProperty({ type: () => User })
	@OneToOne(type => User, usr => usr.trabajador)
	@JoinColumn()
	user: User;
}
