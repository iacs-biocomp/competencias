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
export type ICCompAddDTO = ICCompDTO;

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
 */
export type ICCompCContrDTO = ICCompDTO & {
	catContr: RemovePropsInU<RequiredAndNotNull<ICatContr>, object>[];
};

export type ICatCompWithNoModelsDTO = RemovePropsInU<RequiredAndNotNull<ICatComp>, object> & {
	/**El numero de modelos en los que aparece esa categoría competencial */
	nModels: number;
};
