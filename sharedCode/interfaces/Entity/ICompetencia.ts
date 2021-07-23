import { ISubModel } from '.';

/**
 * TODO: Complete
 *  Representa una competencia, tiene la misma estructura que la entidad en el backend
 * y solo se debería usar para crear nuevos tipos como los DTO
 *
 * ```ts
 * const comp: ICompetencia = {
 * id: 'C1',
 * descripcion: 'Default description',
 * createdAt: new Date(),
 * subModels: [{
 * 	id: 1,
 * 	nivel:{
 * 	id:
 * 	}
 * }]
 * }
 * ```
 * @author aml360 <aml360esp@gmail.com>
 *
 */
export interface ICompetencia {
	// TODO: Tsdoc con ejemplos de posibles id de comps
	id: string;
	// TODO: Tsdoc
	descripcion: string;
	// TODO: Tsdoc
	createdAt: Date;
	// TODO: Tsdoc
	subModels?: ISubModel[];
}
