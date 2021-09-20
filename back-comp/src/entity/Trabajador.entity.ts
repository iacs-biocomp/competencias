import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PeriodoTrab, User } from './index';
import { ITrabajador } from 'sharedInterfaces/Entity';
import { ITrabajadorDTO } from 'sharedInterfaces/DTO';

@Entity('trabajador')
export class Trabajador extends BaseEntity implements ITrabajador {
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
	departamento?: string;

	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(() => PeriodoTrab, periodoTrab => periodoTrab.trabajador, { nullable: false })
	periodos?: PeriodoTrab[];

	//* Descomentar el objeto options (nullable: false), si un trabajador no puede existir sin tener un usuario asociado (username y contraseña)
	@ApiProperty({ type: () => User })
	@OneToOne(() => User, usr => usr.trabajador /*, { nullable: false } */)
	@JoinColumn()
	user?: User;

	/**
	 * Funcion que instancia un Trabajador (Patrón builder) Es necesario añadir la catComp y catContr al unico periodo que tiene.
	 * @param workerDto El dto con la información del trabajador a crear
	 * @returns Retorna una instancia de tipo Trabajador, no guardada en la base de datos
	 */
	public static buildFromPost(workerDto: ITrabajadorDTO): Trabajador {
		const trabajador = new Trabajador();
		trabajador.dni = workerDto.dni;
		trabajador.nombre = workerDto.nombre;
		trabajador.apellidos = workerDto.apellidos;
		trabajador.area = workerDto.area;
		trabajador.unidad = workerDto.unidad;
		trabajador.departamento = workerDto.departamento;
		const periodo = new PeriodoTrab();
		periodo.actual = true;
		trabajador.periodos = [periodo];

		return trabajador;
	}

	static isTrabajadorWithPeriodos(trab: Trabajador): trab is TrabajadorWithPeriodos {
		return !!trab.periodos;
	}
}

interface TrabajadorWithPeriodos extends Trabajador {
	periodos: NonNullable<Trabajador['periodos']>;
}
