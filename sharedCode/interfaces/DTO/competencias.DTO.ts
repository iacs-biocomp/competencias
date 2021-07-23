import { ICompetencia } from '../Entity';

export type ICompNoId = Omit<ICompetencia, 'id' | 'createdAt'>;

type ICompBaseDTO = Pick<ICompetencia, 'id' | 'descripcion'>;

export type ICompNoRelationsDTO = ICompBaseDTO & {
	createdAt: Date;
};

/**
 * Base type when requesting competences from database
 * @example
 * ```ts
 * const comp: ICompDTO = {
 * 	id: 'C1',
 * 	descripcion: 'Default description',
 * }
 * ```
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export type ICompGetDTO = ICompBaseDTO;

/**
 * Type used to add a competence to the database
 *
 * @example
 * ```ts
 * const compToAdd: ICompAddDTO = {
 * 	id: 'C1',
 * 	descripcion: 'Default description'
 * }
 * ```
 * @author aml360 <aml360esp@gmail.com>
 */
export type ICompAddDTO = ICompBaseDTO;
