import {
	BaseEntity,
	Entity,
	Column,
	OneToMany,
	PrimaryColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PeriodoTrab } from './PeriodoTrab.entity';

@Entity('trabajador')
export class Trabajador extends BaseEntity {
	@PrimaryColumn('varchar')
	dni: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	nombre: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	apellidos: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	area: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	unidad: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	departamento: string;

	@OneToMany((type) => PeriodoTrab, (periodoTrab) => periodoTrab.trabajador)
	periodos: PeriodoTrab[];

	@OneToOne((type) => User, (usr) => usr.trabajador)
	@JoinColumn()
	user: User;
}
