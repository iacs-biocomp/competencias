import { IComportamiento } from '../Entity';

export type IComportNoId = Omit<IComportamiento, 'id' | 'subModels'>;

/**
 * TODO: tsdoc in english
 * @author aml360 <aml360esp@gmail.com>
 */
type IComportBaseDTO = Pick<IComportamiento, 'descripcion'>;

/**
 * TODO: tsdoc in english
 * @author aml360 <aml360esp@gmail.com>
 */
export type IComportAddDTO = IComportBaseDTO & Pick<IComportamiento, 'id'>;

/**
 * TODO: tsdoc in english
 * @author aml360 <aml360esp@gmail.com>
 */
export type IComportGetDTO = IComportAddDTO;

export type IComportPutDTO = IComportAddDTO;
