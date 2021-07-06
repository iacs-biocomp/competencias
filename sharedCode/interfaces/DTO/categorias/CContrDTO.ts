import { ICatComp, ICatContr } from '../../Entity';

/**
 *  Tipo usado para añadir una nueva Categoría contractual
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CContrAddDTO = Pick<ICatContr, 'description' | 'id'>;

/**
 * Tipo usado al pedir la información basica de una cContractual y su cComp asociada
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CContrAndCComp = Pick<ICatContr, 'id' | 'description'> & {
	catComp: Pick<ICatComp, 'id' | 'description'>;
};
