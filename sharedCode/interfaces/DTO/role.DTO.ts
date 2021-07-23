import { IRole } from '../Entity';
import { PickPropsInU, TsPrimitiveTypes } from '../Utility';

/**
 *
 * @author aml360 <aml360esp@gmail.com>
 */
export type IRoleDTO = PickPropsInU<IRole, TsPrimitiveTypes>;
