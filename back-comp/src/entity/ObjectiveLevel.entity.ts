import { ApiProperty } from '@nestjs/swagger';
import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Competencia, Ev, Nivel } from '.';

@Entity()
export class ObjectiveLevel extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ type: () => Competencia })
	@OneToOne(() => Competencia, { eager: true, onDelete: 'NO ACTION' })
	@JoinColumn()
	competencia: Competencia;

	@ApiProperty({ type: () => Nivel })
	@OneToOne(() => Nivel, { eager: true, onDelete: 'NO ACTION' })
	@JoinColumn()
	nivel: Nivel[];

	@ApiProperty()
	@ManyToOne(() => Ev, ev => ev.nivelesObjetivo)
	ev?: Ev;
}
