import { IUser } from '../Entity';
import { PickPropsInU, RequiredAndNotNull, TsPrimitiveTypes } from '../Utility';
import { IRoleDTO } from './role.DTO';

/**
 * @author aml360 <aml360esp@gmail.com>
 */
export type IUserDTO = Omit<IUser, 'roles' | 'trabajador'> & {
	roles: IRoleDTO[];
};

export type IUserGetDTO = PickPropsInU<RequiredAndNotNull<IUser>, TsPrimitiveTypes> & {
	roles: IRoleDTO[];
};
