import { RemovePropsInU, RequiredAndNotNull } from '../../Utility';
import { ICatComp, ICatContr } from '../../Entity';

/**
 * TODO: Tsdoc
 * Dto para añadir una nueva catComp
 *
 * ```ts
 * Objeto de ejemplo aqui
 * ```
 */
export type ICCompAddDTO = ICCompDTO & {
	catContr: RemovePropsInU<ICatContr, object>;
};

/**
 * TODO: Tsdoc
 * Dto para añadir una nueva catComp
 *
 * ```ts
 * Objeto de ejemplo aqui
 * ```
 */
export type ICCompDTO = RemovePropsInU<RequiredAndNotNull<ICatComp>, object>;

/**
 * TODO: Tsdoc
 * ```ts
 * Objeto de ejemplo aqui
 * ```
 * TODO: Posiblemente deprecated y llamar catContrs
 */
export type ICCompCContrDTO = ICCompDTO & {
	catContr: RemovePropsInU<ICatContr, object>[];
};
