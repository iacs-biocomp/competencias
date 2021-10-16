import { ICompetencia } from '../Entity';
import { Expand } from '../Utility';

/** @deprecated will be removed, copy to entity file if this type is needed */
export type ICompNoId = Omit<ICompetencia, 'id' | 'createdAt'>;

/**
 * Base type shared by many DTOs
 */
export type ICompBaseDTO = Pick<ICompetencia, 'id' | 'descripcion'>;

/**
 * Base type when requesting competences from database
 * @example
 * ```ts
 * const comp: ICompGetDTO = {
 * 	id: 'C1',
 * 	descripcion: 'Default description',
 *  createdAt: new Date(),
 * }
 * ```
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export type ICompGetDTO = Expand<ICompBaseDTO & Pick<ICompetencia, 'createdAt'>>;

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
