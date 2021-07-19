import { ICatComp, ICatContr } from '../../Entity';
import { RemovePropsInU } from '../../Utility';

/**
 *  Tipo usado para añadir una nueva Categoría contractual
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CContrAddDTO = RemovePropsInU<ICatContr, object>;

/**
 * Tipo usado al pedir la información basica de una cContractual y su cComp asociada
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CContrAndCComp = RemovePropsInU<ICatContr, object> & {
	catComp: RemovePropsInU<ICatComp, object>;
};

export type CatCompWithNoModelsDTO = RemovePropsInU<ICatComp, object> & {
	/**El numero de modelos en los que aparece esa categoría competencial */
	nModels: number;
};
