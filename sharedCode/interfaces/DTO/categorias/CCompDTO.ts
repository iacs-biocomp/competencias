import { PickPropsInU, RemovePropsInU, RequiredAndNotNull, TsPrimitiveTypes } from '../../Utility';
import { ICatComp, ICatContr } from '../../Entity';

/**
 * Dto para añadir una nueva catComp
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CCompAddDTO = RequiredAndNotNull<Pick<ICatComp, 'description' | 'catContr'>>;

/** */
export type CCompDTO = RemovePropsInU<ICatComp, object>;

export type CCompCContrDTO = PickPropsInU<ICatComp, TsPrimitiveTypes> & {
	catContr: RemovePropsInU<ICatContr, object>[];
};
