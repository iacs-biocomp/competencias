import { ICatContr } from '../../Entity';

/**
 *  Tipo usado para añadir una nueva Categoría contractual
 * TODO: Completar documentación añadiendo que endpoints del backend usan este tipo
 */
export type CContrAddDTO = Pick<ICatContr, 'description'>;
