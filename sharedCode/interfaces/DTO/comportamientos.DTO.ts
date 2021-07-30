import { IComportamiento } from '../Entity';
import { Expand } from '../Utility';

/** @deprecated will be removed in the future from this file */
export type IComportNoId = Omit<IComportamiento, 'id' | 'subModels'>;

type IComportBaseDTO = Pick<IComportamiento, 'descripcion'>;

/**
 * use for adding a behaviour to the db
 * @author aml360 <aml360esp@gmail.com>
 */
export type IComportAddDTO = Expand<Pick<IComportamiento, 'id'> & IComportBaseDTO>;

/**
 * use for requesting comports from the backend
 * @author aml360 <aml360esp@gmail.com>
 */
export type IComportGetDTO = IComportAddDTO;

export type IComportPutDTO = IComportAddDTO;
