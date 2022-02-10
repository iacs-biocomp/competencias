import { ApiProperty } from '@nestjs/swagger';
import { INivel } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SubModel } from './index';

@Entity()
export class Nivel extends BaseEntity implements INivel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column({ type: 'varchar', unique: false, nullable: false })
	code: string;

	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	valor: number;

	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	minRango: number;

	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	maxRango: number;

	@ApiProperty()
	@Column({ type: 'boolean', default: false, nullable: false })
	reference: boolean;

	@ApiProperty({ type: () => SubModel })
	@OneToMany(() => SubModel, subm => subm.nivel)
	subModels?: SubModel[];

	static isNivelWithSubModels(nivel: Nivel): nivel is INivelWithSubModels {
		return !!nivel.subModels;
	}
}
interface INivelWithSubModels extends Nivel {
	subModels: NonNullable<Nivel['subModels']>;
}
