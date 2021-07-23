import { ICatComp, ICatContr } from '../../Entity';
import { RemovePropsInU, RequiredAndNotNull } from '../../Utility';

/**
 *  Tipo usado para añadir una nueva Categoría contractual
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type ICContrAddDTO = RemovePropsInU<ICatContr, object>;

/**
 * Tipo usado al pedir la información basica de una cContractual y su cComp asociada
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 * @deprecated name changed to: {@link ICContrAndCCompDTO}, use that instead
 */
export type ICContrAndCComp = RemovePropsInU<ICatContr, object> & {
	catComp: RemovePropsInU<ICatComp, object>;
};

/**
 * Tipo usado al pedir la información basica de una cContractual y su cComp asociada
 */
export type ICContrAndCCompDTO = RemovePropsInU<ICatContr, object> & {
	catComp: RemovePropsInU<RequiredAndNotNull<ICatComp>, object>;
};

export type ICatCompWithNoModelsDTO = RemovePropsInU<RequiredAndNotNull<ICatComp>, object> & {
	/**El numero de modelos en los que aparece esa categoría competencial */
	nModels: number;
};
