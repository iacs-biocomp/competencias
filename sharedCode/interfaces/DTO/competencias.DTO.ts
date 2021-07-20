import { ICompetencia } from '../Entity';
import { PickPropsInU, TsPrimitiveTypes } from '../Utility';

/**
 * Base type when requesting competences from database
 * @example
 * ```ts
 * const comp: ICompDTO = {
 * 	id: 'C1',
 * 	descripcion: 'Default description',
 * 	createdAt: new Date(),
 * }
 * ```
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export type ICompDTO = PickPropsInU<ICompetencia, TsPrimitiveTypes>;

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
export type ICompAddDTO = Omit<ICompDTO, 'createdAt'>;
