import { ICatComp, ICatContr } from '../../Entity';
import { RemovePropsInU, RequiredAndNotNull } from '../../Utility';

/**
 * Should be used only to implement the base class in backend not in front, use other types instead.
 */
export type ICContrBase = RemovePropsInU<RequiredAndNotNull<ICatContr>, object>;

export type ICContrGetDTO = ICContrBase;

/**
 *  Tipo usado para añadir una nueva Categoría contractual
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type ICContrAddDTO = ICContrBase;

/**
 * Tipo usado al pedir la información basica de una cContractual y su cComp asociada
 */
export type ICContrAndCCompDTO = RemovePropsInU<RequiredAndNotNull<ICatContr>, object> & {
	catComp: RemovePropsInU<RequiredAndNotNull<ICatComp>, object>;
};
