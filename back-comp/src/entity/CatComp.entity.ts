import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, OneToMany, PrimaryColumn } from 'typeorm';
import { ICatComp } from 'sharedInterfaces/Entity';
import { CatContr, PeriodoTrab, EvModel, Ev } from './index';

@Entity()
export class CatComp extends BaseEntity implements ICatComp {
	@ApiProperty()
	@PrimaryColumn('varchar')
	id: string;

	/** La descripción de la categoría competencial */
	@ApiProperty()
	@Column({ type: 'varchar', unique: true, length: 100, nullable: false })
	description: string;

	@ApiProperty({ type: () => CatContr })
	@OneToMany(() => CatContr, catContr => catContr.catComp)
	catContr?: CatContr[];

	/** Los periodos en los que aparece esa categoria competencial, según la petición puede ser undefined */
	@ApiProperty({ type: () => PeriodoTrab })
	@OneToMany(() => PeriodoTrab, periodoTrab => periodoTrab.catComp)
	periodosTrab?: PeriodoTrab[];

	@ApiProperty({ type: () => EvModel })
	@OneToMany(() => EvModel, model => model.catComp)
	models?: EvModel[];

	@ApiProperty({ type: () => Ev })
	@OneToMany(() => Ev, ev => ev.catComp)
	evaluaciones?: Ev[];

	static isCatCompWithPeriodos(cComp: CatComp): cComp is CatCompWithPeriodosTrab {
		return !!cComp.periodosTrab;
	}
	static isCatCompWithCatContr(cComp: CatComp): cComp is CatCompWithCatContr {
		return !!cComp.catContr;
	}
}
interface CatCompWithCatContr extends CatComp {
	catContr: NonNullable<CatComp['catContr']>;
}
interface CatCompWithPeriodosTrab extends CatComp {
	periodosTrab: NonNullable<CatComp['periodosTrab']>;
}
interface CatCompWithModels extends CatComp {
	models: NonNullable<CatComp['models']>;
}
interface CatCompWithEvaluaciones extends CatComp {
	evaluaciones: NonNullable<CatComp['evaluaciones']>;
}
